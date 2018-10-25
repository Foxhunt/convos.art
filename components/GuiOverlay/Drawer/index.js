import React, { Component } from 'react'
import autoBind from "react-autobind"
import styled from 'styled-components'

import { connect } from "react-redux"
import { toggleDrawer, toggleWebcam, toggleFullScreen } from "../../../store/actions"

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
                    on={this.state.shapeType === "CIRCLE"}
                    onClick={() => this.setShapeType("CIRCLE")}>
                    Circle
                </Button>
                <Button
                    on={this.state.shapeType === "BOX"}
                    onClick={() => this.setShapeType("BOX")}>
                    Box
                </Button>
                <Button
                    on={this.state.shapeType === "SQUARE"}
                    onClick={() => this.setShapeType("SQUARE")}>
                    Square
                </Button>
                Fill
                <HuePicker
                    width={"100%"}
                    color={this.state.fillStyle}
                    onChange={
                        ({hsl}) => {
                            this.props.canvas.ownBrush.Fill = hslToHex(hsl.h, hsl.s, hsl.l)
                            this.setState({fillStyle: hsl})
                        }
                    } />
                Stroke
                <HuePicker
                    width={"100%"}
                    color={this.state.strokeStyle}
                    onChange={
                        ({hsl}) => {
                            this.props.canvas.ownBrush.Stroke = hslToHex(hsl.h, hsl.s, hsl.l)
                            this.setState({strokeStyle: hsl})
                        }
                    } />
                Particles
                <HuePicker
                    width={"100%"}
                    color={this.state.particleCollor}
                    onChange={
                        ({hsl}) => {
                            this.props.canvas.particles.particleColor = hslToHex(hsl.h, hsl.s, hsl.l)
                            this.setState({particleCollor: hsl})
                        }
                    } />
                <Button
                    on={this.state.particle}
                    onClick={() => this.toggleParticle()}>
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

    setShapeType(shapeType) {
        this.setState({shapeType})
        this.props.canvas.ownBrush.Shape = shapeType
    }

    toggleParticle() {
        this.props.canvas.particles.enabled = !this.props.canvas.particles.enabled
        this.setState({particle: this.props.canvas.particles.enabled})
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
        let hue = this.state.fillStyle.h
        hue += Math.random() * 20;
        hue = hue % 360
        this.setState({ fillStyle: {h: hue, s:1, l: 0.5} })
        this.props.canvas.ownBrush.Fill = hslToHex(hue, 1, 0.5)
    }

    incrementStroke(){
        let hue = this.state.strokeStyle.h
        hue += Math.random() * 20;
        hue = hue % 360
        this.setState({ strokeStyle: {h: hue, s:1, l: 0.5} })
        this.props.canvas.ownBrush.Stroke = hslToHex(hue, 1, 0.5)
    }

    incrementParticle(){
        let hue = this.state.particleCollor.h
        hue += Math.random() * 20;
        hue = hue % 360
        this.setState({ particleCollor: {h: hue, s:1, l: 0.5} })
        this.props.canvas.particles.particleColor = hslToHex(hue, 1, 0.5)
    }
}

const mapStateToProps = state => ({
    showWebcam: state.showWebcam,
    showDrawer: state.showDrawer,
    canvas: state.canvas,
    clickable: state.showGui,
    inFullScreen: state.inFullScreen
})

const mapDispatchToProps = {
	toggleDrawer,
    toggleWebcam,
    toggleFullScreen
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsDrawer)
