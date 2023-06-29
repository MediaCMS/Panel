import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const types = await db.collection('types')
            .find().sort({ title: 1 }).toArray();
        response.json(types);
    },

    read: async (request, response) => {
        const type = await db.collection('types')
            .find({ _id: ObjectId(request.params.id) }).next()
        response.json(type);
    },

    create: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const type = { ...request.body };
        type.level = parseInt(type.level);
        const result = await db.collection('types').insertOne(type);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const type = { ...request.body };
        type.level = parseInt(type.level);
        delete type._id;
        await db.collection('types')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: type }
            );
        response.end();
    },

    delete: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await db.collection('types').deleteOne(
            { _id: new ObjectId(request.params.id) }
        );
        response.end();
    }
}