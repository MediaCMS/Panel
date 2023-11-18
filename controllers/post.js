import db, { ObjectId, filter } from '../db.js';

export default {

    list: async (request, response) => {
        const pipeline = [
            { $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            } },
            { $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            } },
            { $project: {
                date: 1, title: 1, tags: '$tags.title', 
                user: { $arrayElemAt: ['$user.title', 0] },
                status: 1
            } }
        ];
        filter(pipeline, request.query)
        const posts = await db.collection('posts')
            .aggregate(pipeline).toArray()
        //console.log(posts)
        response.json(posts);
    },

    read: async (request, response) => {
        const post = await db.collection('posts')
            .find({ _id: ObjectId(request.params.id) }).next();
        post ? response.json(post) : response.sendStatus(404);
    },

    create: async (request, response) => {
        const post = { ...request.body };
        post.date = new Date(post.date);
        post.category = ObjectId(post.category);
        if (post?.image) {
            post.image = ObjectId(post.image);
        }
        if (post?.tags) {
            post.tags = post.tags.map(tag => ObjectId(tag));
        }
        post.user = ObjectId(post.user);
        const result = await db.collection('posts')
            .insertOne(post);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const post = { ...request.body };
        post._id = ObjectId(post._id);
        if (response.locals.user.role.level === 4) {
            const postOld = await db.collection('posts')
                .find({ _id: post._id }).toArray();
            if (postOld.user !== response.locals.user._id) {
                return response.sendStatus(403);
            }
        }
        post.date = new Date(post.date);
        post.category = ObjectId(post.category);
        if (post?.image) {
            post.image = ObjectId(post.image);
        }
        if (post?.tags) {
            post.tags = post.tags.map(tag => ObjectId(tag));
        }
        post.user = ObjectId(post.user);
        await db.collection('posts')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: post }
            );
        response.end();
    },

    delete: async (request, response) => {
        const _id = new ObjectId(request.params.id);
        if (response.locals.user.role.level === 4) {
            const post = await db.collection('posts')
                .find({ _id }).toArray();
            if (post.user !== response.locals.user._id) {
                return response.sendStatus(403);
            }
        }
        await db.collection('posts').deleteOne({ _id });
        response.end();
    }
}