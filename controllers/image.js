import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const images = await db.collection('images')
            .find().sort({ title: 1 }).toArray();
        response.json(images);
    },

    read: async (request, response) => {
        const image = await db.collection('images')
            .find({ _id: ObjectId(request.params.id) }).next();
        response.json(image);
    },

    create: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const image = { ...request.body };
        image.level = parseInt(image.level);
        const result = await db.collection('images')
            .insertOne(image);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const image = { ...request.body };
        image._id = ObjectId(image._id);
        image.level = parseInt(image.level);
        await db.collection('images')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: image }
            );
        response.end();
    },

    delete: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await db.collection('images')
            .deleteOne({ _id: new ObjectId(request.params.id) });
        response.end();
    }
}