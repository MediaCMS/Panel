const LOAD = 'load'
const INSERT = 'insert'
const UPDATE = 'update'
const MOVE = 'move'
const REMOVE = 'remove'

export const actions = {
    load: (blocks, merge = false) => {
        return { type: LOAD, payload: { blocks, merge } }
    },
    insert: (id, type) => {
        return { type: INSERT, payload: { id, type } }
    },
    update: (id, block, merge = true) => {
        return { type: UPDATE, payload: { id, block, merge } }
    },
    move: (id, direction) => {
        return { type: MOVE, payload: { id, direction } }
    },
    remove: (id, name) => {
        return { type: REMOVE, payload: { id, name } }
    }
}

export default function (state, action) {
    switch (action.type) {
        case LOAD: {
            return action.payload.merge
                ? [ ...state, ...action.payload.blocks ]
                : action.payload.blocks
        }
        case INSERT: {
            const blocks = state.map(block => block)
            blocks.splice(
                state.findIndex(block => block.id === action.payload.id) + 1,
                0,
                { id: Math.round(Date.now() / 1_000), type: action.payload.type }
            )
            return blocks
        }
        case UPDATE: {
            return state.map(block => (
                (block.id === action.payload.id) 
                    ? action.payload.merge 
                        ? { ...block, ...action.payload.block }
                        : action.payload.block
                    : block
            ))
        }
        case MOVE: {
            const blocks = state.map(block => ({ ...block }))
            for(let [index, { ...block }] of Object.entries(blocks)) {
                if (block.id === parseInt(action.payload.id)) {
                    index = parseInt(index)
                    blocks.splice(index, 1)
                    switch (action.payload.direction) {
                        case 'first': blocks.splice(1, 0, block); break
                        case 'last': blocks.push(block); break
                        case 'up': blocks.splice(index - 1, 0, block); break
                        case 'down': blocks.splice(index + 1, 0, block); break
                    }
                    break
                }
            }
            return blocks
        }
        case REMOVE: {
            return state.filter(block => {
                if (block.id !== action.payload.id){
                    return block
                }
                if (typeof action.payload.name !== 'undefined') {
                    delete block[action.payload.name]
                    return block
                }
            })
        }
        default: {
            throw new Error('Unknown block type')
        }
    }
}