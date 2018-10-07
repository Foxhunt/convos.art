import react from 'react'
import styled from 'styled-components'
import { HuePicker } from "react-color"

const Container = styled.div`
	pointer-events: ${({ clickable }) => clickable ? "auto" : "none"};

	position: absolute;
	left: 100%;

	overflow: hidden;

	width: 33vw;
	height: 56.25vw;

	max-width: calc(177.78vh / 3);
	max-height: 100vh;

	background-color: #00ffff;
`

const Button = styled.div`
	width: 100%;
	height: 5%;

	background-color: ${({on}) => on ? "#00ef00" : "#ef0000" };

	border: 3px solid #000000;
`

export default class OptionsDrawer extends react.Component {
    constructor(props) {
        super(props)

        this.state = {
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
                    on={this.props.canvas.ownBrush.shapeType === "CIRCLE"}
                    onClick={() => {
                        this.props.canvas.ownBrush.Shape = "CIRCLE"
                        this.forceUpdate()
                        }}>
                    Circle
                </Button>
                <Button
                    on={this.props.canvas.ownBrush.shapeType === "BOX"}
                    onClick={() => {
                        this.props.canvas.ownBrush.Shape = "BOX"
                        this.forceUpdate()
                        }}>
                    Box
                </Button>
                <Button
                    on={this.props.canvas.ownBrush.shapeType === "SQUARE"}
                    onClick={() => {
                        this.props.canvas.ownBrush.Shape = "SQUARE"
                        this.forceUpdate()
                        }}>
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

function hslToHex(h, s, l) {
    h /= 360
    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

function hexToHSL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
    if(max == min){
        h = s = 0
    }else{
        let d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }
    var HSL = new Object()
    HSL['h']=h * 360
    HSL['s']=s
    HSL['l']=l
    HSL['a']=1
    return HSL
  }
