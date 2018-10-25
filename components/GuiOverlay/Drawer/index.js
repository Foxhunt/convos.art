import React, { Component } from 'react'
import autoBind from "react-autobind"
import styled from 'styled-components'

import { connect } from "react-redux"
import { 
    toggleDrawer,
    toggleWebcam,
    toggleFullScreen,
    setShapeType,
    setStrokeStyle,
    setFillStyle,
    setParticleColor,
    toggleParticles } from "../../../store/actions"

import { HuePicker } from "react-color"

import Button from "./button"
import { hslToHex, hexToHSL } from "./colorFunctions"

const Container = styled.div`
	position: absolute;
    left: ${({show}) => show ? 80 : 100}%;

    pointer-events: auto;

	overflow: hidden;

	width: 20%;
	height: 100%;

	background-color: #00ffff;

    transition: left 500ms;
`

class OptionsDrawer extends Component {
    constructor(props) {
        super(props)
        autoBind(this)

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
        }
    }

    render() {
        return this.canvasConnected &&
            <Container
                show={this.props.showDrawer}>
                <Button
                    on={this.props.shapeType === "CIRCLE"}
                    onClick={() => this.props.setShapeType("CIRCLE")}>
                    Circle
                </Button>
                <Button
                    on={this.props.shapeType === "BOX"}
                    onClick={() => this.props.setShapeType("BOX")}>
                    Box
                </Button>
                <Button
                    on={this.props.shapeType === "SQUARE"}
                    onClick={() => this.props.setShapeType("SQUARE")}>
                    Square
                </Button>
                Fill
                <HuePicker
                    width={"100%"}
                    color={this.props.fillStyle}
                    onChange={
                        ({hsl}) => {
                            this.props.setFillStyle(hslToHex(hsl.h, hsl.s, hsl.l))
                        }
                    } />
                Stroke
                <HuePicker
                    width={"100%"}
                    color={this.props.strokeStyle}
                    onChange={
                        ({hsl}) => {
                            this.props.setStrokeStyle(hslToHex(hsl.h, hsl.s, hsl.l))
                        }
                    } />
                Particles
                <HuePicker
                    width={"100%"}
                    color={this.props.particleColor}
                    onChange={
                        ({hsl}) => {
                            this.props.setParticleColor(hslToHex(hsl.h, hsl.s, hsl.l))
                        }
                    } />
                <Button
                    on={this.props.particles}
                    onClick={this.props.toggleParticles}>
                    toggle Particles
                </Button>
                <Button
                    on={this.state.loco}
                    onClick={() => this.toggleLoco()}>
                    toggle Loco
                </Button>
                <Button
                    on={this.props.showWebcam}
                    onClick={this.props.toggleWebcam}>
                    toggle Webcam
                </Button>
                <Button
                    download="canvas"
                    onClick={this.captureCanvas}>
                    download Canvas
                </Button>
                <Button
                    on={this.props.inFullScreen}
                    onClick={this.props.toggleFullScreen}>
                    toggle FullScreen
                </Button>
            </Container>
    }

	captureCanvas(event) {
		const imgURL = this.props.canvas.htmlCanvas.toDataURL('image/png')
		event.target.href = imgURL
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
    strokeStyle: state.strokeStyle,
    fillStyle: state.fillStyle,
    particles: state.particles,
    particleColor: state.particleColor
})

const mapDispatchToProps = {
	toggleDrawer,
    toggleWebcam,
    toggleFullScreen,
    setShapeType,
    setStrokeStyle,
    setFillStyle,
    setParticleColor,
    toggleParticles
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsDrawer)
