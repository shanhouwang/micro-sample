import { ADD, DELETE } from '../constants/constants'

export const add = (text) => {
    return {
        type: ADD,
        text
    }
}

export const deleteByIndex = (index) => {
    return {
        type: DELETE,
        index
    }
}

export function asyncAdd() {
    return dispatch => {
        setTimeout(() => {
            dispatch(add())
        }, 2000)
    }
}