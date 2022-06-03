"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Photo extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('photos')
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
                    .collection('photos')
                    .find().sort(filter.sort)
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const photo = { ...request.body };
        photo.level = parseInt(photo.level);
        const result = await this.db
            .collection('photos')
            .insertOne(photo);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const photo = { ...request.body };
        photo.level = parseInt(photo.level);
        delete photo._id;
        await this.db
            .collection('photos')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: photo }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await this.db
            .collection('photos')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}