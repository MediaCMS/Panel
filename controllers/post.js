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
                date: 1, title: 1,
                category: 1, tags: '$tags.title', 
                user: { $arrayElemAt: ['$user.title', 0] },
                status: 1
            } }
        ];
        filter(pipeline, request.query, match => {
            if (request.query?.category) {
                match.category = new ObjectId(request.query.category);
            }
            if (request.query?.tag) {
                match.tags = {
                    $regex : request.query.tag, $options : 'i'
                };
            }
        })
        if (response.locals.user.role.level === 4) {
            if (request.query.user !== response.locals.user.title) {
                return response.sendStatus(403);
            }
        }
        const posts = await db.collection('posts')
            .aggregate(pipeline).toArray()
        response.json(posts);
    },

    read: async (request, response) => {
        const post = await db.collection('posts')
            .find({ _id: new ObjectId(request.params.id) }).next();
        post ? response.json(post) : response.sendStatus(404);
    },

    create: async (request, response) => {
        const post = { ...request.body };
        post.date = new Date(post.date);
        post.category = new ObjectId(post.category);
        if (post?.tags) {
            post.tags = post.tags.map(tag => new ObjectId(tag));
        }
        post.user = new ObjectId(post.user);
        const result = await db.collection('posts')
            .insertOne(post);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        const post = { ...request.body };
        post._id = new ObjectId(post._id);
        if (response.locals.user.role.level === 4) {
            const postOld = await db.collection('posts')
                .find({ _id: post._id }).project({ user: true }).next();
            if (postOld.user.toString() !== response.locals.user._id) {
                return response.sendStatus(403);
            }
        }
        post.date = new Date(post.date);
        post.category = new ObjectId(post.category);
        if (post?.tags) {
            post.tags = post.tags.map(tag => new ObjectId(tag));
        }
        post.user = new ObjectId(post.user);
        await db.collection('posts').replaceOne(
            { _id: new ObjectId(request.params.id) },
            { ...post }
        );
        response.end();
    },

    delete: async (request, response) => {
        const _id = new ObjectId(request.params.id);
        if (response.locals.user.role.level === 4) {
            const post = await db.collection('posts')
                .find({ _id }).next();
            if (post.user.toString() !== response.locals.user._id) {
                return response.sendStatus(403);
            }
        }
        await db.collection('posts').deleteOne({ _id });
        response.end();
    }
}