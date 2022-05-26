"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Page extends Controller {

    findOne = async (request, response) => {
        response.json(await (
            await this.db.collection('pages')
                .find({ _id: ObjectId(request.params.id) })
        ).next())
    }

    findMany = async (request, response) => {
        response.json(await (
                await this.db.collection('pages')
                    .find().sort({ title: 1 })
            ).toArray()
        )
    }

    insertOne = async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        const page = { ...request.body };
        page.time = new Date().toISOString();
        page.alias = this.toAlias(page.title);
        page.user = response.locals.user._id;
        const result = await this.db.collection('pages')
            .insertOne(page);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response, next) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        const page = { ...request.body };
        page.alias = this.toAlias(page.title);
        delete page._id;
        delete page.user;
        await this.db.collection('pages')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: page }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        await this.db.collection('pages')
            .deleteOne({ _id: new ObjectId(request.params.id) });
        response.end();
    }
}