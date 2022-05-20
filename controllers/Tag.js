"use strict"

import { ObjectId } from "mongodb";
import Controller from "../Controller.js";

export default class Tag extends Controller {

    findOne = async (request, response) => {
        response.json(
            await (
                await this.db.collection('tags').find(
                    { alias: request.params.alias, status: true }
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
                await this.db.collection('tags').aggregate([
                    { $match: filter.match },
                    { $sort: { [filter.order.field]: filter.order.direction } },
                    { $skip: filter.skip },
                    { $limit: filter.limit }
                ])
            ).toArray()
        )
    }

    autocomplete = async (request, response) => {
        const match = {
            alias: {'$regex' : request.query.string, '$options' : 'i'},
            status: true
        }
        if (request.query?.exclude) {
            match._id = { $nin: request.query.exclude.split(',').map(id => ObjectId(id)) }
        }
        response.json(
            await (
                await this.db.collection('tags')
                    .find(match)
                    .project({ title: true })
                    .sort({ title: 1 })
            ).toArray()
        )
    }

    insertOne = async (request, response) => {}

    replaceOne = async (request, response) => {}

    deleteOne = async (request, response) => {}
}