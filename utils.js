import db, { ObjectId } from './db.js';

// https://gist.github.com/emmanuelnk/92ea809113ef47447b945d1948760221
const cleanEmpty = (obj, defaults = [undefined, null, NaN, '']) => {
    if (defaults.includes(obj)) return

    if (Array.isArray(obj))
        return obj
            .map(v => v && typeof v === 'object' ? cleanEmpty(v, defaults) : v)
            .filter(v => !defaults.includes(v))

    return Object.entries(obj).length 
        ? Object.entries(obj)
            .map(([k, v]) => (
                [k, v && typeof v === 'object' ? cleanEmpty(v, defaults) : v])
            )
            .reduce((a, [k, v]) => (
                defaults.includes(v) ? a : { ...a, [k]: v}
            ), {}) 
        : obj
}

export const parseRequest = request => {
    request.url = decodeURI(request.url);
    request.bodyCleaned = cleanEmpty(request.body)
}

export const logging = (controller, action, user, document) => {
    const log = {
        date: new Date(),
        controller,
        action,
        user: new ObjectId(user)
    };
    if (document) {
        log.document = new ObjectId(document)
    }
    db.collection('log').insertOne(log);
}
