import React, { Component } from 'react'
import autoBind from "react-autobind"
import styled from 'styled-components'
import download from 'downloadjs'

import { connect } from "react-redux"
import { 
    toggleDrawer,
    updateFullScreen,
    toggleRecording
} from "../../../store/actions"

import toggleFullScreen from "../../../src/toggleFullScreen"

import Button from "./button"
import ShapeSelection from "./shapeSelection"
import ShapeConfiguration from "./shapeConfiguration"
import ParticleConfiguration from "./particleConfiguration"
import FilterConfiguration from "./filterConfiguration"

const Container = styled.div`
	position: absolute;
    left: ${({show}) => show ? 80 : 100}%;

    pointer-events: auto;

	overflow: hidden;

	width: 20%;
	height: 100%;

	background-color: #232323;
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    line-height: normal;
    font-size: 0.7em;

    color: #FFFFFF;

    transition: left 0.4s ease-out;
`

class OptionsDrawer extends Component {
    constructor(props) {
        super(props)
        autoBind(this)

        this.recorder = null

        this.canvasConnected = false
    }

    componentDidMount() {
        document.addEventListener("fullscreenchange", this.props.updateFullScreen)
        window.addEventListener("resize", this.props.updateFullScreen)
    }

    componentWillUnmount() {
        document.removeEventListener("fullscreenchange", this.props.updateFullScreen)
        window.removeEventListener("resize", this.props.updateFullScreen)
    }

    componentDidUpdate() {
        if (this.props.canvas && !this.canvasConnected) {
            this.canvasConnected = true

            if(typeof MediaRecorder !== 'undefined'){
                import("../../../src/Recorder").then(({ default: Recorder }) => {
                    this.recorder = new Recorder(this.props.canvas.app.view)
                })
            }
        }
    }

    render() {
        return this.canvasConnected &&
            <Container
                show={this.props.showDrawer}>
                <ShapeSelection />
                <ShapeConfiguration />
                <ParticleConfiguration />
                <FilterConfiguration />
                <Button
                    onClick={this.captureCanvas}>
                    Snapshot
                </Button>
                <Button
                    on={this.props.recording}
                    onClick={this.record}>
                    Record
                </Button>
                <Button
                    onClick={() => {
                        this.props.canvas.clear()
                    }}>
                    Clear
                </Button>
                <Button
                    on={this.props.inFullScreen}
                    onClick={toggleFullScreen}>
                    FullScreen
                </Button>
            </Container>
    }

    record(){
        this.props.toggleRecording()
        if(!this.props.recording){
            this.recorder.start(100)
        }else{
            this.recorder.stop()
        }
    }

	captureCanvas() {
		const imgURL = this.props.canvas.app.view.toDataURL('image/png')
		download(imgURL, 'convos', 'image/png')
	}
}

const mapStateToProps = state => ({
    showDrawer: state.showDrawer,
    canvas: state.canvas,
    clickable: state.showGui,
    inFullScreen: state.inFullScreen,
    recording: state.recording
})

const mapDispatchToProps = {
    toggleDrawer,
    updateFullScreen,
    toggleRecording
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsDrawer)
