import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [];
        pipeline.push(
            { $lookup: {
                from: 'users',
                localField: 'user', 
                foreignField: '_id', 
                as: 'user'
            } },
            { $project: {
                date: 1, controller: 1, action: 1, user: {
                    $arrayElemAt: ['$user.title', 0]
                }, document: 1
            } }
        );
        filter(pipeline, request.query, match => {
            if (request.query?.controller) {
                match.controller = { $regex: request.query.controller }
            }
            if (request.query?.action) {
                match.action = { $regex: request.query.action }
            }
            if (request.query?.user) {
                match.user = {
                    $regex : request.query.user,
                    $options : 'i'
                }
            }
            if (request.query?.document) {
                match.document = { $regex: request.query.document }
            }
        })
        const logs = await db.collection('logs')
            .aggregate(pipeline).toArray();
        response.json(logs);
    },

    create: async (request, response, controller, action) => {
        const log = { date: new Date(), controller, action };
        if (request.params?.id) {
            log.document = new ObjectId(request.params.id)
        }
        log.user = new ObjectId(response.locals.user._id);
        db.collection('logs').insertOne(log);
    }
}