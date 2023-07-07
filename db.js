import { MongoClient, ObjectId } from 'mongodb';
import config from './config.js';

const client = new MongoClient(config.db.url, config.db.options);
const db = client.db();
await client.connect();

function sort(value, init = { title: 1 }) {
    const sort = init;
    if (value) {
        value.split(',').forEach(item => {
            const [field, order] = item.split(':');
            sort[field] = parseInt(order ?? 1);
        })
    }
    return sort;
}

function skip(page = 1) {
    return (page - 1) * config.limit;
}

const limit = config.limit;

export { db as default, client, ObjectId, sort, skip, limit };
