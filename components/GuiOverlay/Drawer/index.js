import React, { Component } from 'react'
import autoBind from "react-autobind"
import styled from 'styled-components'
import download from 'downloadjs'

import { connect } from "react-redux"
import { 
    toggleDrawer,
    toggleWebcam,
    toggleFullScreen,
    setShapeType,
    setStrokeStyle,
    setFillStyle,
    setFillImage,
    setParticleColor,
    toggleRecording,
    toggleParticles } from "../../../store/actions"

import { HuePicker } from "react-color"

import Button from "./button"
import ShapeSelection from "./shapeSelection"
import ShapeConfiguration from "./shapeConfiguration"
import ParticleConfiguration from "./particleConfiguration"
import { hslToHex, hexToHSL } from "./colorFunctions"

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

        this.state = {
            shapeType: null,
            fillStyle: null,
            strokeStyle: null,
            particleCollor: null,
            loco: false,
            particle: true
        }

        this.loco = false
        this.fillStyleIntervall = null
        this.strokeStyleIntervall = null
        this.particleCollorIntervall = null

        this.canvasConnected = false
    }

    componentDidUpdate() {
        if (this.props.canvas && !this.canvasConnected) {
            this.canvasConnected = true
            this.setState({
                shapeType: this.props.canvas.ownBrush.shapeType,
                fillStyle: hexToHSL(this.props.canvas.ownBrush.fillStyle),
                strokeStyle: hexToHSL(this.props.canvas.ownBrush.strokeStyle),
                particleCollor: hexToHSL(this.props.canvas.particles.particleColor)
            })

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
                <ShapeSelection
                    shapeType={this.props.shapeType}
                    setShapeType={this.props.setShapeType} />
                <ShapeConfiguration />
                <ParticleConfiguration />
                <Button
                    on={this.props.particles}
                    onClick={this.props.toggleParticles}>
                    Particles
                </Button>
                <Button
                    on={this.state.loco}
                    onClick={() => this.toggleLoco()}>
                    Loco
                </Button>
                <Button
                    on={this.props.showWebcam}
                    onClick={this.props.toggleWebcam}>
                    Webcam
                </Button>
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
                    on={this.props.inFullScreen}
                    onClick={this.props.toggleFullScreen}>
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

    toggleLoco() {
        if(this.state.loco) {
            this.setState({loco: false})
            clearInterval(this.loco)
            clearInterval(this.fillStyleIntervall)
            clearInterval(this.strokeStyleIntervall)
            clearInterval(this.particleCollorIntervall)
            this.fillStyleIntervall = null
            this.strokeStyleIntervall = null
            this.particleCollorIntervall = null
        } else {
            this.setState({loco: true})
            this.fillStyleIntervall = setInterval(() => this.incrementFill(), 20 + Math.random() * 10)
            this.strokeStyleIntervall = setInterval(() => this.incrementStroke(), 20 + Math.random() * 10)
            this.particleCollorIntervall = setInterval(() => this.incrementParticle(), 20 + Math.random() * 10)
        }
    }

    incrementFill(){
        let hue = hexToHSL(this.props.fillStyle).h
        hue += Math.random() * 20;
        hue = hue % 360
        this.props.setFillStyle(hslToHex(hue, 1, 0.5))
    }

    incrementStroke(){
        let hue = hexToHSL(this.props.strokeStyle).h
        hue += Math.random() * 20;
        hue = hue % 360
        this.props.setStrokeStyle(hslToHex(hue, 1, 0.5))
    }

    incrementParticle(){
        let hue = hexToHSL(this.props.particleColor).h
        hue += Math.random() * 20;
        hue = hue % 360
        this.props.setParticleColor(hslToHex(hue, 1, 0.5))
    }
}

const mapStateToProps = state => ({
    showWebcam: state.showWebcam,
    showDrawer: state.showDrawer,
    canvas: state.canvas,
    clickable: state.showGui,
    inFullScreen: state.inFullScreen,
    shapeType: state.shapeType,
    particles: state.particles,
    recording: state.recording
})

const mapDispatchToProps = {
	toggleDrawer,
    toggleWebcam,
    toggleFullScreen,
    setShapeType,
    setStrokeStyle,
    setFillStyle,
    setFillImage,
    toggleParticles,
    toggleRecording
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsDrawer)
