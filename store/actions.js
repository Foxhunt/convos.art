import * as actionTypes from "./actionTypes"

import fullScreenToggle from "./toggleFullScreen"

export const touchCanvas = () => ({
    type: actionTypes.TOUCH_CANVAS
})

export const releaseCanvas = () => ({
    type: actionTypes.RELEASE_CANVAS
})

export const toggleDrawer = () => ({
    type: actionTypes.TOGGLE_DRAWER
})

export const setDrawer = show => ({
    type: actionTypes.SET_DRAWER,
    show
})

export const toggleWebcam = () => ({
    type: actionTypes.TOGGLE_WEBCAM
})

export const toggleFullScreen = () => {
    fullScreenToggle()
    return { type: actionTypes.TOGGLE_FULLSCREEN }
}

export const setCanvas = canvas => ({
    type: actionTypes.SET_CANVAS,
    canvas
})
