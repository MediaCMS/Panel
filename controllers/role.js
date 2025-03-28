import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const roles = await db.collection('roles')
            .find().sort({ level: 1 }).toArray()
        response.json(roles);
    },

    read: async (request, response) => {
        const role = await db.collection('roles')
            .find({ _id: new ObjectId(request.params.id) }).next()
        role ? response.json(role) : response.sendStatus(404);
    },

    readByUser: async (userID) => {
        const user = await db.collection('users')
            .aggregate([
                { $match: {
                    _id: new ObjectId(userID)
                } },
                { $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                } }
            ]).next();
        return user.role[0];
    },

    create: async (request, response) => {
        const role = { ...request.body };
        role.level = parseInt(role.level);
        const result = await db.collection('roles')
            .insertOne(role);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const role = { ...request.body };
        role._id = new ObjectId(role._id);
        role.level = parseInt(role.level);
        await db.collection('roles').replaceOne(
            { _id: new ObjectId(request.params.id) },
            { ...role }
        );
        response.end();
    },

    delete: async (request, response, next) => {
        const _id = new ObjectId(request.params.id);
        const count = await db.collection('users')
            .countDocuments({ role: _id });
        if (count) {
            return next(
                Error(`Роль використана в користувачах (${count})`)
            )
        }
        await db.collection('roles').deleteOne({ _id });
        response.end();
    }
}