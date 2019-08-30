import { ADD, DELETE } from '../constants/constants'

const INITIAL_STATE = {
    data: []
}

export default function manageTodos(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ADD:
            return {
                ...state,
                data: state.data.concat(action.text)
            }
        case DELETE:
            return {
                ...state,
                data: state.data.splice(0, 1)
            }
        default:
            return state;
    }
}