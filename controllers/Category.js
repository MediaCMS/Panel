"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Category extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('categories')
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
                await this.db
                    .collection('categories')
                    .find().sort(filter.sort)
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        const category = { ...request.body };
        category.time = new Date().toISOString();
        category.alias = this.toAlias(category.title);
        category.order = parseInt(category.order);
        category.user = response.locals.user._id;
        const result = await this.db
            .collection('categories')
            .insertOne(category);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        const category = { ...request.body };
        category.alias = this.toAlias(category.title);
        category.order = parseInt(category.order);
        delete category._id;
        delete category.user;
        await this.db
            .collection('categories')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: category }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        await this.db
            .collection('categories')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}