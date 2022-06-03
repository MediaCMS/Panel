"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Type extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('types')
                    .find(
                        { _id: ObjectId(request.params.id) }
                    )
            ).next()
        );
    }

    findMany = async (request, response) => {
        const filter = this.getFilter(request.query)
        response.json(
            await (
                await this.db
                    .collection('types')
                    .find().sort(filter.sort)
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const type = { ...request.body };
        type.level = parseInt(type.level);
        const result = await this.db
            .collection('types')
            .insertOne(type);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const type = { ...request.body };
        type.level = parseInt(type.level);
        delete type._id;
        await this.db
            .collection('types')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: type }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await this.db
            .collection('types')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}