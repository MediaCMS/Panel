"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Tag extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db
                    .collection('tags')
                    .find(
                        { _id: ObjectId(request.params.id) }
                    )
            ).next()
        )
    }

    findMany = async (request, response) => {
        const filter = this.getFilter(
            { ['сортування-поле']: 'title', ...request.query }
        )
        response.json(
            await (
                await this.db
                    .collection('tags')
                    .find(filter.match)
                    .sort(filter.sort)
                    .skip(filter.skip)
                    .limit(filter.limit)
            ).toArray()
        )
    }

    autocomplete = async (request, response) => {
        const match = {
            alias: {'$regex' : request.query.string, '$options' : 'i'},
            status: true
        }
        if (request.query?.exclude) {
            match._id = {
                $nin: request.query.exclude.split(',').map(id => ObjectId(id))
            }
        }
        response.json(
            await (
                await this.db
                    .collection('tags')
                    .find(match)
                    .project({ title: 1 })
                    .sort({ title: 1 })
            ).toArray()
        )
    }

    insertOne = async (request, response) => {
        const tag = { ...request.body };
        tag.time = new Date().toISOString();
        tag.alias = this.toAlias(tag.title);
        tag.user = response.locals.user._id;
        const result = await this.db
            .collection('tags')
            .insertOne(tag);
        response.end(result.insertedId.toString());
    }

    updateOne = async (request, response) => {
        const tag = { ...request.body };
        tag.alias = this.toAlias(tag.title);
        delete tag._id;
        delete tag.user;
        await this.db
            .collection('tags')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: tag }
            );
        response.end();
    }

    deleteOne = async (request, response) => {
        await this.db
            .collection('tags')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}