import { ADD, DELETE } from '../constants/constants'

export default createReducer(fromJS({
    data: []
}), {
        [ADD]: (state) => {
            const counterState = state.toJS()
            return state.merge({
                data: counterState.num + 1
            })
        },
        [MINUS]: (state) => {
            const counterState = state.toJS()
            return state.merge({
                num: counterState.num - 1
            })
        }
    })
