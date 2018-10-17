import React, { Component } from 'react'
import styled from 'styled-components'

import { HuePicker } from "react-color"

import Button from "./button"
import { hslToHex, hexToHSL } from "./colorFunctions"

const Container = styled.div`
	pointer-events: ${({ clickable }) => clickable ? "auto" : "none"};

	position: absolute;
	left: 100%;

	overflow: hidden;

	width: 20vw;
	height: 56.25vw;

	max-width: calc(177.78vh / 3);
	max-height: 100vh;

	background-color: #00ffff;
`

export default class OptionsDrawer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            shapeType: null,
            fillStyle: null,
            strokeStyle: null,
            particleCollor: null,
            loco: false,
            particle: true,
            Webcam: false
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
                onPointerDown={() => this.props.setDraggable(false)}
                onPointerUp={() => this.props.setDraggable(true)}
                clickable={this.props.clickable}>
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
                    on={this.state.Webcam}
                    onClick={() => this.toggleWebcam()}>
                    toggle Webcam
                </Button>
            </Container>
    }

    setShapeType(shapeType) {
        this.setState({shapeType})
        this.props.canvas.ownBrush.Shape = shapeType
    }

    toggleWebcam(){
        this.props.toggleWebcam()
        this.setState({ Webcam: !this.state.Webcam })
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
