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
                    { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
                    { $project: { time: 1, title: 1, status: 1, user: { $arrayElemAt: ["$user.title", 0] } } },
                    { $match: filter.match },
                    { $sort: { [filter.order.field]: filter.order.direction } },
                    { $skip: filter.skip },
                    { $limit: filter.limit }
                ])
            ).toArray()
        );
    }

    insertOne = async (request, response) => {
        console.log('insert', request.body);
        const result = await this.db.collection('articles')
            .insertOne(request.body);
        console.log('result', result, result.insertedId.toString());
        response.end(result.insertedId.toString());
    }

    replaceOne = async (request, response) => {
        console.log('update', request.params, request.body);
        const id = new ObjectId(request.params.id);
        const result = await this.db.collection('articles')
            .replaceOne({ _id: id }, { ...request.body, ...{ _id: id } });
        console.log('result', result);
        response.end();
    }

    deleteOne = async (request, response) => {
        console.log('delete', request.params, request.body);
        await this.db.collection('articles')
            .deleteOne({ _id: new ObjectId(request.params.id) })
        response.end();
    }
}