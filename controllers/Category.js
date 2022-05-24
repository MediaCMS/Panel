"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Category extends Controller {

    findOne = async (request, response) => {
        response.json(await (
            await this.db.collection('categories')
                .find({ _id: ObjectId(request.params.id) })
        ).next());
    }

    findMany = async (request, response) => {
        response.json(await (
            await this.db.collection('categories')
                .find().sort({ order: 1 })
        ).toArray());
    }

    insertOne = async (request, response) => {
        const result = await this.db.collection('categories')
            .insertOne(
                this.prepare(
                    { ...request.body, ...{ user: response.locals.user._id } }
                )
            );
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response, next) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        if (request.params.id !== request.body._id) {
            return next(
                new Error('Помилковий ідентифікатор категорії')
            );
        }
        await this.db.collection('categories')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: this.prepare(request.body) }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        await this.db.collection('categories')
            .deleteOne({ _id: new ObjectId(request.params.id) });
        response.end();
    }

    prepare(category) {
        if (category?._id) {
            category._id = ObjectId(category._id);
        }
        category.time = new Date(category.time);
        category.alias = this.toAlias(category.title);
        category.order = parseInt(category.order);
        if (category?.user) {
            category.user = ObjectId(category.user);
        }
        return category;
    }
}