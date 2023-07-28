import db, { ObjectId, sort, skip, limit } from '../db.js';

export default {

    list: async (request, response) => {
        const match = {};
        //console.log(match)
        const pipeline = [
                { $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                } },
                { $match: match },
                { $project: {
                    time: 1, body: 1, user: {
                        $arrayElemAt: ['$user.title', 0]
                    }, status: 1
                } },
                { $sort: sort(request.query?.sort, { time: -1 }) },
                { $skip: skip(request.query?.page) },
                { $limit: limit }
            ]
        //console.log(pipeline)
        const comments = await db.collection('comments')
            .aggregate(pipeline).toArray()
        response.json(comments);
    },

    read: async (request, response) => {
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
    },

    create: async (request, response) => {
        /*
        if ((response.locals.user.role.level > 5)) {
            return response.sendStatus(403);
        }
        const comment = { ...request.body };
        const result = await db.collection('comments')
            .insertOne(comment);
        response.end(result.insertedId.toString());
        */
    },

    update: async (request, response) => {
        if ((response.locals.user.role.level > 3)) {
            return response.sendStatus(403);
        }
        const comment = { ...request.body };
        await db.collection('comments')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: comment }
            );
        response.end();
    },

    delete: async (request, response) => {
        if ((response.locals.user.role.level > 3)) {
            return response.sendStatus(403);
        }
        await db.collection('comments').deleteOne({
            _id: new ObjectId(request.params.id)
        });
        response.end();
    }
}