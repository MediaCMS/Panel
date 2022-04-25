"use strict"

import { ObjectId } from 'mongodb';
import jwt from "jsonwebtoken";
import Controller from "../Controller.js";
import settings from "../settings.js";

export default class User extends Controller {

    find = async (request, response) => {
        response.json(await (
            await this.db.collection('users')
                .find({ role: new ObjectId("61fae1ba6be8f90a409ecda6"), status: true })
                .sort({ title: 1 })
        ).toArray());
    }

    findOne = async (request, response) => {
        response.json(await (
            await this.db.collection('users').find({ alias: request.params.alias, status: true })
        ).next());
    }

    insert = async (request, response) => {}

    update = async (request, response) => {}

    remove = async (request, response) => {}

    login = async (request, response) => {
        const [email, password] =
            Buffer.from(request.headers.authorization.split(' ')[1], 'base64').toString().split(':');
        const [user] = await (
            await this.db.collection('users').aggregate([
                { $lookup: { from: "roles", localField: "role", foreignField: "_id", as: "role" } },
                { $project: {
                    title: 1, description: 1, image: 1, email: 1, password: 1, alias: 1, status: 1, 
                    role: { $arrayElemAt: [ "$role.title", 0 ] }
                } },
                { $match: { email: email, password: password, status: true }},
            ])
        ).toArray();
        if (!user) return response.sendStatus(401);
        delete user.email;
        delete user.password;
        delete user.status;
        response.cookie('token', jwt.sign(user, settings.key), { maxAge: settings.cookie.maxAge, httpOnly: true });
        delete user._id;
        response.json(user);
    }

    logout = async (request, response) => {
        response.clearCookie('token');
        response.end();
    }
}