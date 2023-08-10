import db, { ObjectId, sort, skip, limit } from '../db.js';

export default {

    list: async (request, response) => {
        //const filter = this.getFilter(request.query);
        const match = {};
        const pipeline = [
            { $match: match },
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
            } },
            { $sort: sort(request.query?.sort, { time: -1 }) },
            { $skip: skip(request.query?.page) },
            { $limit: limit }
        ]
        const posts = await db.collection('posts')
            .aggregate(pipeline).toArray()
        console.log(posts[0].time, posts[0].time.toString(), posts[0].time.toISOString())
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
                    time: 1, title: 1, description: 1, body: 1, image: 1, slug: 1,
                    category: 1, tags: { _id: 1, title: 1 }, type: 1, user: 1, status: 1
                }}
            ]).next();
        console.log(post)
        response.json(post);
    },

    create: async (request, response) => {
        if ((response.locals.user.role.level > 4)) {
            return response.sendStatus(403);
        }
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
        if ((response.locals.user.role.level > 4)) {
            return response.sendStatus(403);
        }
        if ((response.locals.user.role.level === 4)
            && (response.locals.user._id !== request.body.user)) {
            return response.sendStatus(403);
        }
        console.log(response.locals.user.role.level)
        const post = { ...request.body };
        post._id = ObjectId(post._id);
        console.log(post.time)
        post.time = new Date(post.time);
        console.log(post.time.toISOString())
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
        if (response.locals.user.role.level > 4) {
            return response.sendStatus(403);
        }
        const _id = new ObjectId(request.params.id);
        if ((response.locals.user.role.level === 4)) {
            const post = await db.collection('posts')
                .find({ _id }).toArray();
            if (response.locals.user._id !== post.user) {
                return response.sendStatus(403);
            }
        }
        await db.collection('posts').deleteOne({ _id });
        response.end();
    }
}