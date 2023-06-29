import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const match = {};
        const logs = await db.collection('logs').find(match)
            .sort(sort(request.query?.sort)).toArray();
        response.json(logs);
    },

    read: async (request, response) => {
        const log = await db.collection('logs')
            .find({ _id: ObjectId(request.params.id) }).next();
        response.json(log);
    },
/*
    // ToDo: move to DB as Proxy?
    create = async (request, response) => {
        if ((response.locals.user.role.level > 1)) {
            return response.sendStatus(403);
        }
        const log = { ...request.body };
        log.level = parseInt(log.level);
        const result = await db.collection('logs')
            .insertOne(log);
        response.end(result.insertedId.toString());
    }

    update = async (request, response) => {
        response.end();
    }

    delete = async (request, response) => {
        response.end();
    }
*/
}