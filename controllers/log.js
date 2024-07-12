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
                match.document = new ObjectId(request.query.document)
            }
        })
        const logs = await db.collection('log')
            .aggregate(pipeline).toArray();
        response.json(logs);
    }
}