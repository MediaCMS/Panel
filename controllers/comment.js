import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [
            { $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            } },
            { $project: {
                time: 1, body: 1, user: {
                    $arrayElemAt: ['$user.title', 0]
                }, status: 1
            } }
        ];
        filter(pipeline, request.query, match => {
            if (request.query?.body) {
                match.body = {
                    '$regex' : request.query.body, '$options' : 'i'
                }
            }
            if (request.query?.user) {
                match.user = {
                    '$regex' : request.query.user, '$options' : 'i'
                }
            }
        })
        const comments = await db.collection('comments')
            .aggregate(pipeline).toArray()
        response.json(comments);
    },

    read: async (request, response, next) => {
        const comment = await db.collection('comments')
            .aggregate([
                { $match: {
                    _id: ObjectId(request.params.id) }
                },
                { $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                } },
                { $project: {
                    _id: 0, time: 1, body: 1, user: {
                        $arrayElemAt: ['$user.title', 0]
                    }, status: 1
                } }
            ]).next();
        response.json(comment);
        next();
    },

    create: async (request, response, next) => {
        const comment = { ...request.body };
        const result = await db.collection('comments')
            .insertOne(comment);
        response.end(result.insertedId.toString());
        next();
    },

    update: async (request, response, next) => {
        const comment = { ...request.body };
        comment._id = ObjectId(comment._id);
        await db.collection('comments')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: comment }
            );
        response.end();
        next();
    },

    delete: async (request, response, next) => {
        await db.collection('comments').deleteOne({
            _id: new ObjectId(request.params.id)
        });
        response.end();
        next();
    }
}