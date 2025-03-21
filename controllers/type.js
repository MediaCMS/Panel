import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const types = await db.collection('types')
            .find().sort({ time: -1 }).toArray();
        response.json(types);
    },

    read: async (request, response) => {
        const type = await db.collection('types')
            .find({ _id: new ObjectId(request.params.id) }).next()
        type ? response.json(type) : response.sendStatus(404);
    },

    create: async (request, response) => {
        const type = { ...request.body };
        const result = await db.collection('types')
            .insertOne(type);
        request.params.id = result.insertedId.toString();
        response.end(request.params.id);
    },

    update: async (request, response) => {
        const type = { ...request.body };
        type._id = new ObjectId(type._id);
        await db.collection('types').replaceOne(
            { _id: new ObjectId(request.params.id) },
            { ...type }
        );
        response.end();
    },

    delete: async (request, response, next) => {
        const _id = new ObjectId(request.params.id);
        const count = await db.collection('posts').count({ type: _id });
        if (count > 0) {
            return next(
                Error(`Тип використаний в публікаціях (${count})`)
            )
        }
        await db.collection('types').deleteOne({ _id });
        response.end();
    }
}