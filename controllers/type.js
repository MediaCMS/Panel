import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const types = await db.collection('types')
            .find().sort({ time: -1 }).toArray();
        response.json(types);
    },

    read: async (request, response, next) => {
        const type = await db.collection('types')
            .find({ _id: ObjectId(request.params.id) }).next()
        response.json(type);
        next();
    },

    create: async (request, response, next) => {
        const type = { ...request.body };
        const result = await db.collection('types')
            .insertOne(type);
        request.params.id = result.insertedId.toString();
        log('type', 'create', id, response.locals.user._id);
        response.end(request.params.id);
        next()
    },

    update: async (request, response, next) => {
        const type = { ...request.body };
        type._id = ObjectId(type._id);
        await db.collection('types').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: type }
        );
        response.end();
        next();
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
        next();
    }
}