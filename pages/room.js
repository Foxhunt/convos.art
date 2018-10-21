import react from 'react'
import autoBind from 'react-autobind'
import styled from 'styled-components'
import { withRouter } from 'next/router'

import { connect } from "react-redux"
import { touchCanvas, releaseCanvas, setCanvas } from "../store/actions"

import GuiOverlay from '../components/GuiOverlay'

const Background = styled.div`
display: flex;
background-color: #00ff00;
justify-content: center;
align-items: center;

width: 100vw;
height: 100vh;
`

const Canvas = styled.canvas`
background-color: yellow;
width: 100vw;
height: 56.25vw;

max-height: 100vh;
max-width: 177.78vh;
`

class Room extends react.Component{
    constructor(props){
        super(props)
        autoBind(this)
        this.htmlCanvas = react.createRef()
    }

    async componentDidMount () {
        const { default: room } = await import("../src/Room")
        const canvas = await room(this.props.router.query.roomId, this.htmlCanvas.current)
        this.props.setCanvas(canvas)
    }

    render() {
        return (
            <Background>
                <Canvas
                    id="myCanvas"
                    width="1920"
                    height="1080"
                    onPointerDown={this.props.touchCanvas}
                    onPointerUp={this.props.releaseCanvas}
                    ref={this.htmlCanvas}
                />
                <GuiOverlay />
            </Background>
        )
    }
}

const mapDispatchToProps = {
    touchCanvas,
    releaseCanvas,
    setCanvas
}

export default withRouter(connect(undefined, mapDispatchToProps)(Room))
