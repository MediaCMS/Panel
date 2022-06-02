"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";
import settings from "../settings.js";
import jwt from "jsonwebtoken";

export default class User extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('users')
                    .find(
                        { _id: ObjectId(request.params.id) }
                    )
            ).next()
        );
    }

    findMany = async (request, response) => {
        const filter = this.getFilter(request.query);
        response.json(
            await (
                await this.db.collection('users').aggregate([
                    { $lookup: 
                        { from: "roles", localField: "role", foreignField: "_id", as: "role" }
                    },
                    { $project:
                        { time: 1, title: 1, role: { $arrayElemAt: ["$role", 0] }, status: 1 }
                    },
                    { $match: filter.match },
                    { $sort: filter.sort },
                    { $skip: filter.skip },
                    { $limit: filter.limit }
                ])
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        const role = await (
            await this.db
                .collection('roles')
                .find(
                    { _id: ObjectId(request.body.role) }
                )
        ).next()
        if ((response.locals.user.role.level >= role.level)) {
            return response.sendStatus(403);
        }
        const user = { ...request.body };
        user.time = new Date().toISOString();
        user.alias = this.toAlias(user.title);
        user.role = ObjectId(user.role);
        user.user = response.locals.user._id;
        const result = await this.db
            .collection('users')
            .insertOne(user);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        const role = await (
            await this.db
                .collection('roles')
                .find(
                    { _id: ObjectId(request.body.role) }
                )
        ).next()
        if ((response.locals.user.role.level >= role.level)) {
            return response.sendStatus(403);
        }
        const user = { ...request.body };
        user.alias = this.toAlias(user.title);
        user.role = ObjectId(user.role);
        delete user._id;
        if (!user.password) {
            delete user.password;
        }
        delete user.user;
        await this.db
            .collection('users')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: user }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        const user = await (
            await this.db
                .collection('users')
                .aggregate([
                    { $lookup: 
                        { from: "roles", localField: "role", foreignField: "_id", as: "role" }
                    },
                    { $project:
                        { role: { $arrayElemAt: ["$role", 0] } }
                    },
                    { $match: { _id: ObjectId(request.params.id) } }
                ])
        ).next()
        if ((response.locals.user.role.level >= user.role.level)) {
            return response.sendStatus(403);
        }
        await this.db
            .collection('users')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }

    login = async (request, response) => {
        const [email, password] = Buffer
            .from(request.headers.authorization.split(' ')[1], 'base64')
            .toString().split(':');
        const [user] = await (
            await this.db.collection('users').aggregate([
                { $lookup: {
                    from: "roles", localField: "role", foreignField: "_id", as: "role"
                } },
                { $project: {
                    title: 1, description: 1, image: 1, email: 1, password: 1, alias: 1, status: 1, 
                    role: { $arrayElemAt: ["$role", 0] }
                } },
                { $match: {
                    email: email, password: password, status: true
                }},
            ])
        ).toArray();
        if (!user) {
            return response.sendStatus(401);
        }
        if (user.role.level > 3) {
            return response.sendStatus(403);
        }
        delete user.email;
        delete user.password;
        delete user.status;
        response.cookie('token', jwt.sign(user, settings.key), {
            maxAge: settings.cookie.maxAge, httpOnly: true
        });
        delete user._id;
        response.json(user);
    }

    logout = async (request, response) => {
        response.clearCookie('token');
        response.end();
    }
}