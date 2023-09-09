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
            { $project: {
                time: 1, title: 1, status: 1, user: {
                    $arrayElemAt: ['$user.title', 0]
                }
            } }
        ];
        filter(pipeline, request.query, match => {
            if (request.query?.user) {
                match.user = {
                    $regex : request.query.user, '$options' : 'i'
                }
            }
            if (request.query?.date) {
                match.time = {}
                if (request.query.date?.start) {
                    match.time.$gte = new Date(request.query.date.start)
                }
                if (request.query.date?.end) {
                    match.time.$lte = new Date(request.query.date.end)
                }
            }
        })
        const posts = await db.collection('posts')
            .aggregate(pipeline).toArray()
        response.json(posts);
    },

    read: async (request, response) => {
        const post = await db.collection('posts')
            .aggregate([
                { $match: { _id: ObjectId(request.params.id) } },
                { $lookup: {
                    from: 'tags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tags'
                } },
                { $project: {
                    time: 1, title: 1, description: 1, body: 1, image: 1,
                    category: 1, tags: { _id: 1, title: 1 }, type: 1,
                    user: 1, slug: 1, status: 1
                }}
            ]).next();
        response.json(post);
    },

    create: async (request, response) => {
        const post = { ...request.body };
        post.time = new Date(post.time);
        post.category = ObjectId(post.category);
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
        post.time = new Date(post.time);
        post.category = ObjectId(post.category);
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