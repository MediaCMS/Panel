import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const category = await db.collection('categories')
            .find().sort({ order: 1 }).toArray();
        response.json(category);
    },

    read: async (request, response) => {
        const category = await db.collection('categories')
            .find({ _id: ObjectId(request.params.id) }).next()
        response.json(category);
    },

    create: async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        const category = { ...request.body };
        category.time = new Date().toISOString();
        //category.alias = this.toAlias(category.title);
        category.order = parseInt(category.order);
        category.user = response.locals.user._id;
        const result = await db.collection('categories')
            .insertOne(category);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        const category = { ...request.body };
        category.order = parseInt(category.order);
        delete category._id;
        delete category.user;
        await db.collection('categories').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: category }
        );
        response.end();
    },

    delete: async (request, response, next) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        const _id = new ObjectId(request.params.id);
        const count = await db.collection('posts').count({ category: _id });
        if (count > 0) {
            return next(
                Error(`Категорія використана в публікаціях (${count})`)
            )
        }
        await db.collection('categories').deleteOne({ _id });
        response.end();
    }
}