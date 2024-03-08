const INSERT = 'insert'
const UPDATE = 'update'
const REMOVE = 'remove'

export const actions = {
    insert: (name, item, after = 'insert') => {
        return { type: INSERT, payload: { name, item, after } }
    },
    update: (name, item, merge = true) => {
        return { type: UPDATE, payload: { name, item, merge } }
    },
    remove: name => {
        return { type: REMOVE, payload: { name } }
    }
}

export default function (state, action) {

    let stateNew = {}, callback

    switch (action.type) {
        case INSERT: {
            callback = (name, item) => {
                stateNew[name] = item
                if (name === action.payload.after) {
                    stateNew[action.payload.name] = action.payload.item
                }
            }
            break
        }
        case UPDATE: {
            callback = (name, item) => {
                stateNew[name] = (name === action.payload.name)
                    ? action.payload.merge 
                        ? { ...item, ...action.payload.item }
                        : action.payload.item
                    : item
            }
            break
        }
        case REMOVE: {
            callback = (name, item) => {
                const names = !Array.isArray(action.payload.name)
                    ? [action.payload.name] : action.payload.name
                if (!names.includes(name)) stateNew[name] = item
            }
            break
        }
        default: {
            throw new Error('Unknown menu action')
        }
    }

    Object.entries(state).forEach(([name, item]) => {
        callback(name, item)
    })

    return stateNew
}