import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [];
        filter(pipeline, request.query, match => {
            if (request.query?.name) {
                match.name = request.query.name
            }
            if (request.query?.tagID) {
                match.tags = new ObjectId(request.query.tagID)
            }
        });
        const images = await db.collection('images')
            .aggregate(pipeline).toArray();
        response.json(images);
    },

    read: async (request, response) => {
        const image = await db.collection('images')
            .find({ _id: new ObjectId(request.params.id) }).next();
        image ? response.json(image) : response.sendStatus(404);        
    },

    create: async (request, response) => {
        const image = { ...request.body };
        image.date = new Date(image.date);
        image.tags = image.tags.map(tag => new ObjectId(tag));
        const result = await db.collection('images')
            .insertOne(image);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const image = { ...request.body };
        image._id = new ObjectId(image._id);
        image.date = new Date(image.date);
        image.tags = image.tags.map(tag => new ObjectId(tag));
        await db.collection('images').replaceOne(
            { _id: new ObjectId(request.params.id) },
            { ...image }
        );
        response.end();
    },

    delete: async (request, response) => {
        await db.collection('images').deleteOne({
            _id: new ObjectId(request.params.id)
        })
        response.end();
    }
}