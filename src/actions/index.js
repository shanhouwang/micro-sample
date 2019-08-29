import { ADD, DELETE } from '../constants/constants'

export const add = () => {
    return {
        type: ADD
    }
}

export const deleteByIndex = () => {
    return {
        type: DELETE
    }
}

export function asyncAdd() {
    return dispatch => {
        setTimeout(() => {
            dispatch(add())
        }, 2000)
    }
}