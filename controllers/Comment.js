"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Comment extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('comments')
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
                    .collection('comments')
                    .find().sort(filter.sort)
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const comment = { ...request.body };
        comment.level = parseInt(comment.level);
        const result = await this.db
            .collection('comments')
            .insertOne(comment);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const comment = { ...request.body };
        comment.level = parseInt(comment.level);
        delete comment._id;
        await this.db
            .collection('comments')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: comment }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await this.db
            .collection('comments')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}