import { combineReducers } from "redux"
import * as actionTypes from "./actionTypes"

const showGui = (state = true, action) => {
    switch (action.type) {
        case actionTypes.TOUCH_CANVAS:
            return false
        case actionTypes.RELEASE_CANVAS:
            return true
        default:
            return state
    }
}

const showDrawer = (state = false, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_DRAWER:
            return !state
        case actionTypes.SET_DRAWER:
            return action.show
        case actionTypes.TOUCH_CANVAS:
            return false
        default:
            return state
    }
}

const showWebcam = (state = false, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_WEBCAM:
            return !state
        default:
            return state
    }
}

const canvas = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_CANVAS:
            return action.canvas
        default:
            return state
    }
}

const inFullScreen = (state = false, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_FULLSCREEN:
            return !state
        default:
            return state
    }
}

const shapeType = (state = "CIRCLE", action) => {
    switch (action.type) {
        case actionTypes.SET_SHAPE_TYPE:
            return action.shapeType
        default:
            return state
    }
}

const strokeStyle = (state = "#ff0000", action) => {
    switch (action.type) {
        case actionTypes.SET_STROKE_STYLE:
            return action.style
        default:
            return state
    }
}

const fillStyle = (state = "#0000ff", action) => {
    switch (action.type) {
        case actionTypes.SET_FILL_STYLE:
            return action.style
        default:
            return state
    }
}

const fillImage = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_FILL_IMAGE:
            return action.image
        case actionTypes.SET_FILL_STYLE:
            return null
        default:
            return state
    }
}

const particleColor = (state = "#ff00aa", action) => {
    switch (action.type) {
        case actionTypes.SET_PARTICLE_COLOR:
            return action.color
        default:
            return state
    }
}

const particles = (state = true, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_PARTICLES:
            return !state
        default:
            return state
    }
}

export default combineReducers({
    showGui,
    showDrawer,
    canvas,
    showWebcam,
    inFullScreen,
    shapeType,
    strokeStyle,
    fillStyle,
    fillImage,
    particleColor,
    particles
})