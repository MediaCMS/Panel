import db, { ObjectId } from '../db.js';

export default {

    list: async (request, response) => {
        const match = {};
        const logs = await db.collection('logs').find(match)
            .sort(sort(request.query?.sort)).toArray();
        response.json(logs);
    },

    create: async (request, response, collection, action) => {
        const log = { date: new Date(), collection, action };
        if (request.params?.id) {
            log.document = new ObjectId(request.params.id)
        }
        log.user = new ObjectId(response.locals.user._id);
        db.collection('logs').insertOne(log);
    }
}