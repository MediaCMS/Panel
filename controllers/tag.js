import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [];
        if (request.query?._images) {
            pipeline.push(
                { $lookup: {
                    from: 'images',
                    localField: '_id',
                    foreignField: 'tags',
                    as: 'images'
                } },
                { $project: {
                    title: 1, description: 1, 
                    images: { $size: '$images' }
                } },
                { $match: {
                    images: { $gt: 0 }
                }},
                { $sort: { title: 1 }}
            )
        }
        if (request.query?._compact) {
            pipeline.push(
                { $project: { title: 1, status: 1 } }
            )
        }
        filter(pipeline, request.query)
        const tags = await db.collection('tags')
            .aggregate(pipeline, { collation: { locale: 'uk' }}).toArray()
        response.json(tags);
    },

    read: async (request, response) => {
        const tag = await db.collection('tags')
            .find({ _id: ObjectId(request.params.id) }).next();            
        tag ? response.json(tag) : response.sendStatus(404);
    },

    create: async (request, response) => {
        const tag = { ...request.body };
        const result = await db.collection('tags')
            .insertOne(tag);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const tag = { ...request.body };
        tag._id = ObjectId(tag._id);
        await db.collection('tags').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: tag }
        );
        response.end();
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
    }
}