import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const pages = await db.collection('pages')
            .find().sort({ title: 1 }).toArray();
        response.json(pages);
    },

    read: async (request, response) => {
        const page = await db.collection('pages')
            .find({ _id: ObjectId(request.params.id) }).next();
        response.json(page);
    },

    create: async (request, response) => {
        const page = { ...request.body };
        const result = await db.collection('pages')
            .insertOne(page);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const page = { ...request.body };
        page._id = ObjectId(page._id);
        await db.collection('pages')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: page }
            );
        response.end();
    },

    delete: async (request, response) => {
        await db.collection('pages')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}