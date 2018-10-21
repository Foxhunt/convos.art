import * as actionTypes from "./actionTypes"

export const touchingCanvas = touching => ({
    type: actionTypes.TOUCH_CANVAS,
    touching
})

export const toggleDrawer = show => ({
    type: actionTypes.TOGGLE_DRAWER,
    show
})

export const setCanvas = canvas => ({
    type: actionTypes.SET_CANVAS,
    canvas
})
