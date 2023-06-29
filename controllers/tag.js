import db, { ObjectId, sort, skip, limit } from '../db.js';

export default {

    list: async (request, response) => {
        const match = {};
        const tags = await db.collection('tags')
            .find(match).sort(sort(request.query?.sort))
            .skip(skip(request.query?.page))
            .limit(limit).toArray();
        response.json(tags);
    },

    read: async (request, response) => {
        const tag = await db.collection('tags')
            .find({ _id: ObjectId(request.params.id) }).next();            
        response.json(tag)
    },

    autocomplete: async (request, response) => {
        const match = {
            alias: {
                '$regex' : request.query.string,
                '$options' : 'i'
            },
            status: true
        }
        if (request.query?.exclude) {
            match._id = {
                $nin: request.query.exclude
                    .split(',').map(id => ObjectId(id))
            }
        }
        const tags = await db.collection('tags')
            .find(match).project({ title: 1 })
            .sort({ title: 1 }).toArray();
        response.json(tags);
    },

    create: async (request, response) => {
        const tag = { ...request.body };
        tag.time = new Date().toISOString();
        //tag.alias = this.toAlias(tag.title);
        tag.user = response.locals.user._id;
        const result = await db.collection('tags')
            .insertOne(tag);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const tag = { ...request.body };
        //tag.alias = this.toAlias(tag.title);
        delete tag._id;
        delete tag.user;
        await db.collection('tags').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: tag }
        );
        response.end();
    },

    delete: async (request, response) => {
        await db.collection('tags').deleteOne(
            { _id: new ObjectId(request.params.id) }
        );
        response.end();
    }
}