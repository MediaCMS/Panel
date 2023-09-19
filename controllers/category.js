import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const category = await db.collection('categories')
            .find().sort({ order: 1 }).toArray();
        response.json(category);
    },

    read: async (request, response, next) => {
        const category = await db.collection('categories')
            .find({ _id: ObjectId(request.params.id) }).next()
        response.json(category);
        next();
    },

    create: async (request, response, next) => {
        const category = { ...request.body };
        category.order = parseInt(category.order);
        const result = await db.collection('categories')
            .insertOne(category);
        response.end(result.insertedId.toString());
        next();
    },

    update: async (request, response, next) => {
        const category = { ...request.body };
        category._id = ObjectId(category._id);
        category.order = parseInt(category.order);
        await db.collection('categories').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: category }
        );
        response.end();
        next();
    },

    delete: async (request, response, next) => {
        const _id = new ObjectId(request.params.id);
        const count = await db.collection('posts').count({ category: _id });
        if (count > 0) {
            return next(
                Error(`Категорія використана в публікаціях (${count})`)
            )
        }
        await db.collection('categories').deleteOne({ _id });
        response.end();
        next();
    }
}