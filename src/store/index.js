import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'

export default function configStore() {
    return createStore(rootReducer, applyMiddleware(...middlewares))
}