import { MongoClient, ObjectId } from 'mongodb';
import config from './config.js';

const client = new MongoClient(config.db.url, config.db.options);
const db = client.db();
await client.connect();

function filter(pipeline, query, callback) {
    const match = {};
    if (query?._id) {
        match._id = { $in: query._id.map(id => ObjectId(id)) }
    }
    if (query?.date) {
        match.date = {}
        if (query.date?.start) {
            match.date.$gte = new Date(query.date.start + 'T00:00:00')
        }
        if (query.date?.end) {
            match.date.$lte = new Date(query.date.end + 'T23:59:59')
        }
    }
    if (query?.title) {
        match.title = { $regex : query.title, $options : 'i' }
    }
    if (callback) callback(match);
    if (query?.user) {
        match.user = { $regex : query.user, $options : 'i' }
    }
    if (('status' in query) && (query.status !== '')) {
        match.status = query.status === 'true';
    }
    if (query?._exclude) {
        match._id = {
            $nin: query._exclude.split(',').map(id => ObjectId(id))
        }
    }
    pipeline.push({ $match: match })
    if (query?._sort) {
        pipeline.push({ $sort: { 
            [query._sort.field]: parseInt(query._sort.order ?? 1)
        }})
    }
    if (query?._skip) {
        pipeline.push({ $skip: query._skip })
    }
    const limit = query._limit ?? config.limit;
    pipeline.push({ '$limit': limit })
}

export { db as default, client, ObjectId, filter };
