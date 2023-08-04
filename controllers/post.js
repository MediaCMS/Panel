import db, { ObjectId, sort, skip, limit } from '../db.js';

export default {

    list: async (request, response) => {
        //const filter = this.getFilter(request.query);
        const match = {};
        console.log(match)
        const pipeline = [
            { $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            } },
            { $match: match },
            { $project: {
                time: 1, title: 1, status: 1, user: {
                    $arrayElemAt: ['$user.title', 0]
                }
            } },
            { $sort: sort(request.query?.sort, { time: -1 }) },
            { $skip: skip(request.query?.page) },
            { $limit: limit }
        ]
        console.log(pipeline)
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
                    time: 1, title: 1, description: 1, body: 1, image: 1, slug: 1,
                    category: 1, tags: { _id: 1, title: 1 }, user: 1, status: 1
                }}
            ]).next();
        response.json(post);
    },

    create: async (request, response) => {
        const post = { ...request.body };
        post.time = new Date().toISOString();
        //post.slug = this.toslug(post.title);
        post.order = parseInt(post.order);
        if (post?.tags) {
            post.tags = post.tags.map(tag => ObjectId(tag));
        }
        post.user = response.locals.user._id;
        const result = await db.collection('posts')
            .insertOne(post);
        response.end(result.insertedId.toString());
    },

    update: async (request, response) => {
        if ((response.locals.user.role.level === 3)
            && (response.locals.user._id !== request.body.user)) {
            return response.sendStatus(403);
        }
        const post = { ...request.body };
        post.time = new Date(post.time);
        post.slug = this.toslug(post.title);
        post.category = ObjectId(post.category);
        if (post?.tags) {
            post.tags = post.tags.map(tag => ObjectId(tag));
        }
        post._id = ObjectId(post._id);
        //delete post.user;
        await db.collection('posts')
            .updateOne(
                { _id: ObjectId(request.params.id) },
                { $set: post }
            );
        response.end();
    },

    delete: async (request, response) => {
        if ((response.locals.user.role.level > 2)) {
            return response.sendStatus(403);
        }
        await db.collection('posts')
            .deleteOne(
                { _id: new ObjectId(request.params.id) }
            );
        response.end();
    }
}