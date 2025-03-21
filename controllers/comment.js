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
                date: 1, text: 1, user: {
                    $arrayElemAt: ['$user.title', 0]
                }, status: 1
            } }
        ];
        filter(pipeline, request.query, match => {
            if (request.query?.text) {
                match.text = {
                    '$regex' : request.query.text, '$options' : 'i'
                }
            }
            if (request.query?.user) {
                match.user = {
                    '$regex' : request.query.user, '$options' : 'i'
                }
            }
        })
        const comments = await db.collection('comments')
            .aggregate(pipeline).toArray();
        response.json(comments);
    },

    read: async (request, response) => {
        const comment = await db.collection('comments')
            .find({ _id: new ObjectId(request.params.id) }).next();
        comment ? response.json(comment) : response.sendStatus(404);
    },

    create: async (request, response) => {
        const comment = { ...request.body };
        comment.date = new Date(comment.date);
        const result = await db.collection('comments')
            .insertOne(comment);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const comment = { ...request.body };
        comment._id = new ObjectId(comment._id);
        comment.date = new Date(comment.date);
        comment.user = new ObjectId(comment.user);
        await db.collection('comments').replaceOne(
            { _id: new ObjectId(request.params.id) },
            { ...comment }
        );
        response.end();
    },

    delete: async (request, response) => {
        await db.collection('comments').deleteOne({
            _id: new ObjectId(request.params.id)
        });
        response.end();
    }
}