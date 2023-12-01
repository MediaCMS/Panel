import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [];
        filter(pipeline, request.query);
        const images = await db.collection('images')
            .aggregate(pipeline).toArray()
        response.json(images);
    },

    read: async (request, response) => {
        const image = await db.collection('images')
            .find({ _id: ObjectId(request.params.id) }).next();
        image ? response.json(image) : response.sendStatus(404);        
    },

    create: async (request, response) => {
        const image = { ...request.body };
        image.date = new Date(image.date);
        image.tags = image.tags.map(tag => ObjectId(tag));
        const result = await db.collection('images')
            .insertOne(image);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const image = { ...request.body };
        image._id = ObjectId(image._id);
        image.date = new Date(image.date);
        image.tags = image.tags.map(tag => ObjectId(tag));
        await db.collection('images')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: image }
            );
        response.end();
    },

    check: async (request, response) => {
        /*
        const usage = {};
        const _id = new ObjectId(request.params.id)
        const posts = await db.collection('posts')
            .find({ $or: [
                { image: _id },
                { body: { $regex : request.params.id } }
            ]})
            .project({ title: 1 }).toArray();
        if (posts.length) usage.posts = posts;
        const pages = await db.collection('pages')
            .find({ $or: [
                { image: _id },
                { body: { $regex : request.params.id } }
            ]})
            .project({ title: 1 }).toArray();
        if (pages.length) usage.pages = pages;
        const categories = await db.collection('categories')
            .find({ image: _id }).project({ title: 1 }).toArray();
        if (categories.length) usage.categories = categories;
        const types = await db.collection('types')
            .find({ image: _id }).project({ title: 1 }).toArray();
        if (types.length) usage.types = types;
        const tags = await db.collection('tags')
            .find({ image: _id }).project({ title: 1 }).toArray();
        if (tags.length) usage.tags = tags;
        const users = await db.collection('users')
            .find({ image: _id }).project({ title: 1 }).toArray();
        if (users.length) usage.users = users;
        */
        response.end(false);
    },

    delete: async (request, response) => {
        response.end(
            await db.collection('images').deleteOne({ _id: request.params._id })
        );
    }
}