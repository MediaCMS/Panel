"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Article extends Controller {

    findOne = async (request, response) => {
        // ToDo: access control
        response.json(await (await this.db.collection('articles').aggregate([
            { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } },
            { $project: {
                time: 1, title: 1, description: 1, body: 1, image: 1, alias: 1,
                category: 1, tags: { _id: 1, title: 1 }, status: 1
            }},
            { $match: { _id: ObjectId(request.params.id) } }
        ])).next());
    }

    findMany = async (request, response) => {
        const filter = this.getFilter(request.query);
        response.json(
            await (
                await this.db.collection('articles').aggregate([
                    { $lookup: 
                        { from: "users", localField: "user", foreignField: "_id", as: "user" }
                    },
                    { $project:
                        { time: 1, title: 1, status: 1, user: { $arrayElemAt: ["$user.title", 0] } }
                    },
                    { $match: filter.match },
                    { $sort: { [filter.order.field]: filter.order.direction } },
                    { $skip: filter.skip },
                    { $limit: filter.limit }
                ])
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        // ToDo: access control
        const result = await this.db.collection('articles')
            .insertOne(
                this.toObjectId(
                    { ...request.body, ...{ user: response.locals.user._id } }
                )
            );
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response, next) => {
        // ToDo: access control
        if (request.params.id !== request.body._id) {
            return next(new Error('Помилковий ідентифікатор статті'));
        }
        await this.db.collection('articles')
            .updateOne(
                { _id: ObjectId(request.params.id) }, { $set: this.toObjectId(request.body) }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        // ToDo: access control
        await this.db.collection('articles')
            .deleteOne({ _id: new ObjectId(request.params.id) });
        response.end();
    }

    toObjectId(article) {
        if (article?._id) {
            article._id = ObjectId(article._id);
        }
        article.category = ObjectId(article.category)
        if (article?.tags) {
            article.tags = article.tags.map(tag => ObjectId(tag));
        }
        if (article?.user) {
            article.user = ObjectId(article.user);
        }
        return article;
    }
}