import db, { ObjectId, sort, skip, limit } from '../db.js';

export default {

    list: async (request, response) => {
        const match = {}
        if (request.query?.title) {
            match.title = {
                '$regex' : request.query.title,
                '$options' : 'i'
            }
        }
        if (request.query?.status) {
            match.status = request.query?.status === 'true'
        }
        if (request.query?._exclude) {
            match._id = {
                $nin: request.query._exclude
                    .split(',').map(id => ObjectId(id))
            }
        }
        const tags = await db.collection('tags')
            .find(match)
            .sort(sort(request.query?.sort))
            .skip(skip(request.query?.page))
            .limit(limit)
            .toArray();
        response.json(tags);
    },

    read: async (request, response) => {
        const tag = await db.collection('tags')
            .find({ _id: ObjectId(request.params.id) }).next();            
        response.json(tag)
    },
/*
    autocomplete: async (request, response) => {
        if ((response.locals.user.role.level > 4)) {
            return response.sendStatus(403);
        }
        const match = {
            title: {
                '$regex' : request.query.prompt,
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
*/
    create: async (request, response) => {
        if ((response.locals.user.role.level > 3)) {
            return response.sendStatus(403);
        }
        const tag = { ...request.body };
        const result = await db.collection('tags')
            .insertOne(tag);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        if ((response.locals.user.role.level > 3)) {
            return response.sendStatus(403);
        }
        const tag = { ...request.body };
        tag._id = ObjectId(tag._id);
        await db.collection('tags').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: tag }
        );
        response.end();
    },

    delete: async (request, response) => {
        if ((response.locals.user.role.level > 3)) {
            return response.sendStatus(403);
        }
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
    }
}