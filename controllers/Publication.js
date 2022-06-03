"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Publication extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('publications')
                    .aggregate([
                        { $lookup: {
                            from: "tags", localField: "tags", foreignField: "_id", as: "tags"
                        } },
                        { $project: {
                            time: 1, title: 1, description: 1, body: 1, image: 1, alias: 1,
                            category: 1, tags: { _id: 1, title: 1 }, status: 1
                        }},
                        { $match: { _id: ObjectId(request.params.id) } }
                    ])
            ).next()
        );
    }

    findMany = async (request, response) => {
        const filter = this.getFilter(request.query);
        response.json(
            await (
                await this.db
                    .collection('publications')
                    .aggregate([
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
        const publication = { ...request.body };
        publication.time = new Date().toISOString();
        publication.alias = this.toAlias(publication.title);
        publication.order = parseInt(publication.order);
        if (publication?.tags) {
            publication.tags = publication.tags.map(tag => ObjectId(tag));
        }
        publication.user = response.locals.user._id;
        const result = await this.db
            .collection('publications')
            .insertOne(publication);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        if ((response.locals.user.role.level === 3)
            && (response.locals.user._id !== request.body.user)) {
            return response.sendStatus(403);
        }
        const publication = { ...request.body };
        publication.time = new Date(publication.time);
        publication.alias = this.toAlias(publication.title);
        publication.category = ObjectId(publication.category);
        if (publication?.tags) {
            publication.tags = publication.tags.map(tag => ObjectId(tag));
        }
        delete publication._id;
        delete publication.user;
        await this.db
            .collection('publications')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: publication }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        await this.db
            .collection('publications')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}