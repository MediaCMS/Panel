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
        response.json(image);
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
        const _id = new ObjectId(request.params.id)
        const image = await db.collection('images')
            .find({ _id }).next();
        console.log(image)
        const count = await db.collection('posts').count({ $or: [
            { image: image.path }, { body: { $regex : image.path } }
        ]});
        console.log(count)
        if (count > 0) {
            return next(
                Error(`Зображення використане в публікаціях (${count})`)
            )
        }
        // check posts (main and body)
        // check pages (main and body)
        // check categories
        // check types
        // check tags
        // check users
        //await db.collection('images').deleteOne({ _id });
        console.log('image deleted')
        return next(
            Error(`Не можу визначити використання зображення`)
        )
        response.end();
    }
}