import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const pages = await db.collection('pages')
            .find().sort({ title: 1 }).toArray();
        response.json(pages);
    },

    read: async (request, response, next) => {
        const page = await db.collection('pages')
            .find({ _id: ObjectId(request.params.id) }).next();
        response.json(page);
        next();
    },

    create: async (request, response, next) => {
        const page = { ...request.body };
        const result = await db.collection('pages')
            .insertOne(page);
        response.end(result.insertedId.toString());
        next();
    },

    update: async (request, response, next) => {
        const page = { ...request.body };
        page._id = ObjectId(page._id);
        await db.collection('pages')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: page }
            );
        response.end();
        next();
    },

    delete: async (request, response, next) => {
        await db.collection('pages')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
        next();
    }
}