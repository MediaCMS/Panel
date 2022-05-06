"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Article extends Controller {

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

    find = async (request, response) => {
        response.json(await (await this.db.collection('articles').aggregate([
            { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
            { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } },
            { $project: {
                time: 1, title: 1, description: 1, body: 1, image: 1, alias: 1,
                category: { $arrayElemAt: ["$category", 0] }, tags: 1, status: 1
            }},
            { $match: { _id: ObjectId(request.params.id) } }
        ])).next());
    }

    insert = async (request, response) => {}

    update = async (request, response) => {}

    remove = async (request, response) => {}
}