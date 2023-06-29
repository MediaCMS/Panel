import db, { ObjectId, sort, skip, limit } from '../db.js';
import config from '../config.js';
import jwt from 'jsonwebtoken';

export default {

    list: async (request, response) => {
        const match = {}
        console.log(match)
        const pipeline = [
            { $lookup: {
                from: 'roles',
                localField: 'role', 
                foreignField: '_id', 
                as: 'role'
            } },
            { $project: {
                time: 1, title: 1, role: {
                    $arrayElemAt: ['$role', 0]
                }, status: 1
            } },
            { $match: match },
            { $sort: sort(request.query?.sort) },
            { $skip: skip(request.query?.page) },
            { $limit: limit }
        ];
        console.log(pipeline)
        const users = await db.collection('users')
            .aggregate(pipeline).toArray();
        response.json(users);
    },

    read: async (request, response) => {
        const user = await db.collection('users')
            .find({ _id: ObjectId(request.params.id) }).next();
        response.json(user);
    },

    create: async (request, response) => {
        const role = await db.collection('roles')
            .find({ _id: ObjectId(request.body.role) }).next();
        if ((response.locals.user.role.level >= role.level)) {
            return response.sendStatus(403);
        }
        const user = { ...request.body };
        user.time = new Date().toISOString();
        //user.alias = this.toAlias(user.title);
        user.role = ObjectId(user.role);
        user.user = response.locals.user._id;
        const result = await db.collection('users').insertOne(user);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const role = await db.collection('roles')
            .find({ _id: ObjectId(request.body.role) }).next();
        if ((response.locals.user.role.level >= role.level)) {
            return response.sendStatus(403);
        }
        const user = { ...request.body };
        //user.alias = this.toAlias(user.title);
        user.role = ObjectId(user.role);
        delete user._id;
        if (!user.password) {
            delete user.password;
        }
        delete user.user;
        await db.collection('users').updateOne(
            { _id: ObjectId(request.params.id) },
            { $set: user }
        );
        response.end();
    },

    delete: async (request, response) => {
        const user = await db.collection('users')
            .aggregate([
                { $lookup: {
                    from: 'roles',
                    ocalField: 'role',
                    foreignField: '_id',
                    as: 'role'
                } },
                { $project: {
                    role: { $arrayElemAt: ['$role', 0] }
                } },
                { $match: {
                    _id: ObjectId(request.params.id)
                } }
            ]).next()
        if ((response.locals.user.role.level >= user.role.level)) {
            return response.sendStatus(403);
        }
        await db.collection('users').deleteOne({
            _id: new ObjectId(request.params.id)
        });
        response.end();
    },

    login: async (request, response) => {
        const [email, password] = Buffer
            .from(request.headers.authorization.split(' ')[1], 'base64')
            .toString().split(':');
        const [user] = await db.collection('users')
            .aggregate([
                { $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                } },
                { $project: {
                    title: 1, description: 1, image: 1,
                    email: 1, password: 1, alias: 1, status: 1, 
                    role: { $arrayElemAt: ["$role", 0] }
                } },
                { $match: {
                    email: email, password: password, status: true
                }},
            ]).toArray();
        if (!user) {
            return response.sendStatus(401);
        }
        if (user.role.level > 3) {
            return response.sendStatus(403);
        }
        delete user.email;
        delete user.password;
        delete user.status;
        response.cookie('token', jwt.sign(user, config.key), {
            maxAge: config.cookie.maxAge, httpOnly: true
        });
        delete user._id;
        response.json(user);
    },

    logout: async (request, response) => {
        response.clearCookie('token');
        response.end();
    }
}