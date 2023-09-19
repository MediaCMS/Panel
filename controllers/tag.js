import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [];
        filter(pipeline, request.query)
        const tags = await db.collection('tags')
            .aggregate(pipeline).toArray()
        response.json(tags);
    },

    read: async (request, response, next) => {
        const tag = await db.collection('tags')
            .find({ _id: ObjectId(request.params.id) }).next();            
        response.json(tag)
        next();
    },

    create: async (request, response, next) => {
        const tag = { ...request.body };
        const result = await db.collection('tags')
            .insertOne(tag);
        response.end(result.insertedId.toString());
        next();
    },

    update: async (request, response, next) => {
        const tag = { ...request.body };
        tag._id = ObjectId(tag._id);
        await db.collection('tags').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: tag }
        );
        response.end();
        next();
    },

    delete: async (request, response, next) => {
        const _id = new ObjectId(request.params.id);
        const count = await db.collection('posts').count({ tags: _id });
        if (count > 0) {
            return next(
                Error(`Мітка використана в публікаціях (${count})`)
            )
        }
        await db.collection('tags').deleteOne(
            { _id: new ObjectId(request.params.id) }
        );
        response.end();
        next();
    }
}