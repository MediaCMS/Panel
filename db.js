import { MongoClient, ObjectId } from 'mongodb';
import config from './config.js';

const client = new MongoClient(config.db.url, config.db.options);
const db = client.db();
await client.connect();

function filter(pipeline, query, callback) {
    const match = {};
    if (query?.title) {
        match.title = { '$regex' : query.title, '$options' : 'i' }
    }
    if (callback) callback(match);
    if (query?.status) {
        match.status = query?.status === 'true'
    }   
    if (query?._exclude) {
        match._id = {
            $nin: request.query._exclude
                .split(',').map(id => ObjectId(id))
        }
    }
    if (query?._sort) {
        const sort = {}
        query._sort.split(',').forEach(item => {
            const [field, order] = item.split(':');
            pipeline[field] = parseInt(order ?? 1);
        })
        pipeline.push({ '$sort': sort })
    }
    if (query?._skip) {
        pipeline.push({ '$skip': query._skip })
    }
    const limit = query._limit ?? config.limit;
    pipeline.push({ '$limit': limit })
}

export { db as default, client, ObjectId, filter };
