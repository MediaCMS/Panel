"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Log extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('logs')
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
                    .collection('logs')
                    .find().sort(filter.sort)
            ).toArray()
        );
    }
/*
    // ToDo: move to Controller?
    insertOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const log = { ...request.body };
        log.level = parseInt(log.level);
        const result = await this.db
            .collection('logs')
            .insertOne(log);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        response.end();
    }

    deleteOne = async (request, response) => {
        response.end();
    }
*/
}