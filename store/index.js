import {createStore, applyMiddleware} from "redux"
import logger from "redux-logger"

import reducer from "./reducer"

export function initializeStore( initialState ) {
    return createStore(reducer, initialState, applyMiddleware(logger))
}
