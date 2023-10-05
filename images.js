import fs from 'fs';
import db, { client } from './db.js';
import config from './config.js';

const paths = fs.readFileSync('./images.log', 'utf8').split('\n');

const tags = await db.collection('tags').find({ status: true }).toArray();
console.log(tags[0])

/*
for (const path of paths) {
    const image = {
        date: new Date(),
        title: 'Заголовок зображення #' + path.match(/\/(.{32})\//)[1],
        path: path,
        tags: [tags[Math.floor(Math.random() * tags.length)]._id],
        status: true
    }
    const result = await db.collection('images')
        .insertOne(image);
    console.log(result.insertedId.toString(), image)
}
*/
client.close();
