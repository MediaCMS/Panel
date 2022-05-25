"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Article extends Controller {

    findOne = async (request, response) => {
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
                    { $sort: filter.sort },
                    { $skip: filter.skip },
                    { $limit: filter.limit }
                ])
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        const article = { ...request.body };
        article.time = new Date().toISOString();
        article.alias = this.toAlias(article.title);
        article.order = parseInt(article.order);
         if (article?.tags) {
            article.tags = article.tags.map(tag => ObjectId(tag));
        }
       article.user = response.locals.user._id;
        const result = await this.db.collection('articles')
            .insertOne(article);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response, next) => {
        if ((response.locals.user.role.level === 3)
            && (response.locals.user._id !== request.body.user)) {
            return response.sendStatus(403);
        }
        const article = { ...request.body };
        article.time = new Date(article.time);
        article.alias = this.toAlias(article.title);
        article.category = ObjectId(article.category);
        if (article?.tags) {
            article.tags = article.tags.map(tag => ObjectId(tag));
        }
        delete article._id;
        delete article.user;
        await this.db.collection('articles')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: article }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        await this.db.collection('articles')
            .deleteOne({ _id: new ObjectId(request.params.id) });
        response.end();
    }
}