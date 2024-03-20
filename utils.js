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
    console.log(request.url, request.query, request.body)
    console.dir(request.query)
    console.dir(request.body)
    console.dir(JSON.stringify(request.body))

    request.url = decodeURI(request.url);
    // Convert request params type and remove empty
    Object.entries(request.query).map(([key, value]) => {
        switch(value) {
            case '': delete request.query[key]; break;
            case 'true': request.query[key] = true; break;
            case 'false': request.query[key] = false; break;
            default: {
                if (!isNaN(value)) {
                    request.query[key] = parseFloat(value);
                }
            }
        }
    });
    // Clear empty properties of object
    request.body = cleanEmpty(request.body)
    console.log(request.url, request.query, request.body)
}