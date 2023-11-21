import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [
            { $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            } },
            { $addFields: { tags: '$tags.title' } }
        ];
        filter(pipeline, request.query)
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
        if (image?.tags) {
            image.tags = image.tags.map(tag => ObjectId(tag));
        }
        const result = await db.collection('images')
            .insertOne(image);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const image = { ...request.body };
        image._id = ObjectId(image._id);
        image.date = new Date(image.date);
        if (image?.tags) {
            image.tags = image.tags.map(tag => ObjectId(tag));
        }
        await db.collection('images')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: image }
            );
        response.end();
    },

    delete: async (request, response, next) => {
        const usage = {};
        const _id = new ObjectId(request.params.id)
        //console.log(request.params, _id)
        const image = await db.collection('images')
            .find({ _id }).next();
        //console.log(image);
        usage.posts = await db.collection('posts')
            .find({ $or: [
                { image: _id },
                { body: { $regex : request.params.id } }
            ]})
            .project({ date: 1, title: 1, slug: 1, status: 1 })
            .toArray();
        // check pages (main and body)
        // check categories
        // check types
        // check tags
        // check users
        /*
        return next(
            Error(`Не можу визначити використання зображення`)
        )
        */
        console.log('delete image', _id, usage)
        //await db.collection('images').deleteOne({ _id });
        Object.keys(usage).length ? response.json(usage) : response.end();
    }
}