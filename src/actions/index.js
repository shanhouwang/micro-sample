import * as Actions from '../constants/constants'

export const add = (text) => {
    return {
        type: Actions.ADD,
        text
    }
}

export const deleteByIndex = (index) => {
    return {
        type: Actions.DELETE,
        index
    }
}

export const onMouseOver = (index) => {
    return {
        type: Actions.ON_MOUSE_OVER,
        index
    }
}

export const clickTodosByIndex = (index) => {
    return {
        type: Actions.CLICK_TODOS_BY_INDEX,
        index
    }
}

export const clickAllCheckbox = () => {
    return {
        type: Actions.CLICK_ALL_CHECKBOX
    }
}

export const clearTodos = () => {
    return {
        type: Actions.CLEAR_TODOS
    }
}

export function asyncAdd() {
    return dispatch => {
        setTimeout(() => {
            dispatch(add())
        }, 2000)
    }
}