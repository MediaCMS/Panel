import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const roles = await db.collection('roles')
            .find().sort({ title: 1 }).toArray()
        response.json(roles);
    },

    read: async (request, response) => {
        const role = await db.collection('roles')
            .find({ _id: ObjectId(request.params.id) }).next()
        response.json(role);
    },

    create: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const role = { ...request.body };
        role.level = parseInt(role.level);
        const result = await db.collection('roles')
            .insertOne(role);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const role = { ...request.body };
        role.level = parseInt(role.level);
        delete role._id;
        await db.collection('roles').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: role }
        );
        response.end();
    },

    delete: async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await db.collection('roles').deleteOne(
            { _id: new ObjectId(request.params.id) }
        );
        response.end();
    }
}