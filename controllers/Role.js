"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Role extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('roles')
                    .find(
                        { _id: ObjectId(request.params.id) }
                    )
            ).next()
        );
    }

    findMany = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('roles')
                    .find().sort({ level: 1 })
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const role = { ...request.body };
        role.level = parseInt(role.level);
        const result = await this.db
            .collection('roles')
            .insertOne(role);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const role = { ...request.body };
        role.level = parseInt(role.level);
        delete role._id;
        await this.db
            .collection('roles')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: role }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await this.db
            .collection('roles')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}