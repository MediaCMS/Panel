import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [
            { $lookup: {
                from: 'images',
                localField: 'images',
                foreignField: '_id',
                as: 'images'
            } },
            { $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            } },
            { $addFields: { tags: '$tags.title' } }
        ];
        filter(pipeline, request.query)
        const galleries = await db.collection('galleries')
            .aggregate(pipeline).toArray()
        response.json(galleries);
    },

    read: async (request, response) => {
        const gallery = await db.collection('galleries')
            .find({ _id: ObjectId(request.params.id) }).next();
            gallery ? response.json(gallery) : response.sendStatus(404);        
    },

    create: async (request, response) => {
        const gallery = { ...request.body };
        gallery.date = new Date(gallery.date);
        if (gallery?.tags) {
            gallery.tags = gallery.tags.map(tag => ObjectId(tag));
        }
        const result = await db.collection('galleries')
            .insertOne(gallery);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const gallery = { ...request.body };
        gallery._id = ObjectId(gallery._id);
        gallery.date = new Date(gallery.date);
        if (gallery?.tags) {
            gallery.tags = gallery.tags.map(tag => ObjectId(tag));
        }
        await db.collection('galleries')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: gallery }
            );
        response.end();
    },

    delete: async (request, response, next) => {
        const _id = new ObjectId(request.params.id)
        console.log(request.params, _id)
        const gallery = await db.collection('galleries')
            .find({ _id }).next();
        console.log(gallery)
        /*
        const count = await db.collection('posts').count({ $or: [
            { gallery: _id }, { body: { $regex : request.params.id } }
        ]});
        console.log(count)
        if (count > 0) {
            return next(
                Error(`Зображення використане в публікаціях (${count})`)
            )
        }
        */
        // check posts (main and body)
        // check pages (main and body)
        await db.collection('galleries').deleteOne({ _id });
        response.end();
    }
}