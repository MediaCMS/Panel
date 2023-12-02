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

    delete: async (request, response) => {
        console.log(request.params)
        await db.collection('images').deleteOne({
            _id: ObjectId(request.params.id)
        })
        response.end();
    }
}