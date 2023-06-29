import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const comment = await db.collection('comments')
            .find().sort({ title: 1 }).toArray();
        response.json(comment);
    },

    read: async (request, response) => {
        const comment = await db.collection('comments')
            .find({ _id: ObjectId(request.params.id) }).next();
        response.json(comment);
    },

    create: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const comment = { ...request.body };
        comment.level = parseInt(comment.level);
        const result = await db.collection('comments')
            .insertOne(comment);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const comment = { ...request.body };
        comment.level = parseInt(comment.level);
        delete comment._id;
        await db.collection('comments')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: comment }
            );
        response.end();
    },

    delete: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await db.collection('comments').deleteOne({
            _id: new ObjectId(request.params.id)
        });
        response.end();
    }
}