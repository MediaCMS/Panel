import db from '../db.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Buffer } from 'buffer';
import { logging } from '../utils.js';
import config from '../config.js';

export default {

    login: async (request, response, next) => {
        response.locals.user = { _id: 0 };
        if (response.locals.mode === 'production') {
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
        } 
        const [email, password] = Buffer
            .from(request.headers.authorization.split(' ')[1], 'base64')
            .toString().split(':');
        const pipeline = [
            { $match: {
                email, password, status: true
            } },
            { $lookup: {
                from: 'images',
                localField: 'image',
                foreignField: '_id',
                as: 'image'
            } },
            { $lookup: {
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role'
            } },
            { $project: {
                title: 1, description: 1, slug: 1,
                image: { $arrayElemAt: ["$image.slug", 0] }, 
                role: { $arrayElemAt: ["$role", 0] }
            } }
        ];
        const [user] = await db.collection('users')
            .aggregate(pipeline).toArray();
        if (!user) {
            return response.sendStatus(401);
        }
        if (user.role.level > 4) {
            return response.sendStatus(403);
        }
        response.cookie('token', jwt.sign(user, config.jwt.key), {
            maxAge: config.cookie.maxAge, httpOnly: true
        });
        logging('access', 'login', user._id);
        response.locals.user = user;
        response.json(user);
        next();
    },

    logout: async (request, response, next) => {
        response.clearCookie('token');
        response.end();
        next();
    }
}