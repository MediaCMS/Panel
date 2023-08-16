import db, { ObjectId, sort, skip, limit } from '../db.js';
import roleController from './role.js';
import axios from 'axios';
import config from '../config.js';
import jwt from 'jsonwebtoken';

export default {

    list: async (request, response) => {
        const pipeline = [];
        if (request.query?._compact) {
            pipeline.push(
                { $project: { title: 1, status: 1 } }
            );
        } else {
            pipeline.push(
                { $lookup: {
                    from: 'roles',
                    localField: 'role', 
                    foreignField: '_id', 
                    as: 'role'
                } },
                { $project: {
                    title: 1, email: 1, role: {
                        $arrayElemAt: ['$role.title', 0]
                    }, status: 1
                } }
            );
        }
        const match = {}
        if (request.query?.title) {
            match.title = {
                '$regex' : request.query.title,
                '$options' : 'i'
            }
        }
        if (request.query?.status) {
            match.status = request.query?.status === 'true'
        }
        if (request.query?._exclude) {
            match._id = {
                $nin: request.query._exclude
                    .split(',').map(id => ObjectId(id))
            }
        }
        pipeline.push({ $match: match });
        pipeline.push({ $sort: sort(request.query?.sort) });
        pipeline.push({ $skip: skip(request.query?.page) });
        pipeline.push({ $limit: limit });
        const users = await db.collection('users')
            .aggregate(pipeline).toArray();
        response.json(users);
    },

    read: async (request, response) => {
        const user = await db.collection('users')
            .find({ _id: ObjectId(request.params.id) })
            .project({ password: false }).next();
        response.json(user);
    },

    create: async (request, response) => {
        if (response.locals.user.role.level > 2) {
            return response.sendStatus(403);
        }
        const user = { ...request.body };
        user.role = ObjectId(user.role);
        const role = await db.collection('roles')
            .find({ _id: user.role }).next();
        if (role.level <= response.locals.user.role.level) {
            return response.sendStatus(403);
        }
        const result = await db.collection('users')
            .insertOne(user);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        if (response.locals.user.role.level > 2) {
            return response.sendStatus(403);
        }
        const _id = new ObjectId(request.params.id);
        const role = await roleController.readByUser(_id);
        if (role.level <= response.locals.user.role.level) {
            return response.sendStatus(403);
        }
        const user = { ...request.body };
        user._id = ObjectId(user._id);
        user.role = ObjectId(user.role);
        if (!user.password) {
            delete user.password;
        }
        await db.collection('users')
            .updateOne({ _id }, { $set: user });
        response.end();
    },

    delete: async (request, response) => {
        if (response.locals.user.role.level > 2) {
            return response.sendStatus(403);
        }
        const _id = new ObjectId(request.params.id);
        const role = await roleController.readByUser(_id);
        if (role.level <= response.locals.user.role.level) {
            return response.sendStatus(403);
        }
        const count = { posts: 0, logs: 0 };
        count.posts = await db.collection('posts').count({ user: _id });
        if (count.posts > 0) {
            return next(
                Error(`Користувач використаний в публікаціях (${count.posts})`)
            )
        }
        count.logs = await db.collection('logs').count({ user: _id });
        if (count.logs > 0) {
            return next(
                Error(`Користувач використаний в логах (${count.logs})`)
            )
        }
        await db.collection('users').deleteOne({ _id });
        response.end();
    },

    login: async (request, response, next) => {
        const recaptcha = (await axios({
            method: 'post',
            url: config.google.recaptcha.url,
            params: {
                secret: config.google.recaptcha.key,
                response: request.body.recaptcha
            }
        })).data;
        if (recaptcha.success !== true) {
            return next(
                Error(
                    `Помилка reCaptcha (${recaptcha['error-codes'].join(', ')})`
                )
            );
        }
        const [email, password] = Buffer
            .from(request.headers.authorization.split(' ')[1], 'base64')
            .toString().split(':');
        const pipeline = [
            { $match: {
                email: email, password: password, status: true
            } },
            { $lookup: {
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role'
            } },
            { $project: {
                title: 1, description: 1, image: 1, slug: 1, 
                role: { $arrayElemAt: ["$role", 0] }
            } }
        ];
        const [user] = await db.collection('users')
            .aggregate(pipeline).toArray();
        if (!user) {
            return response.sendStatus(401);
        }
        if (user.role.level > 3) {
            return response.sendStatus(403);
        }
        response.cookie('token', jwt.sign(user, config.jwt.key), {
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