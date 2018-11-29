import react from 'react'
import autoBind from 'react-autobind'
import styled from 'styled-components'
import { withRouter } from 'next/router'

import { connect } from "react-redux"
import { touchCanvas, releaseCanvas, setCanvas } from "../store/actions"

import GuiOverlay from '../components/GuiOverlay'

const Background = styled.div`
display: flex;
background-color: #d4d4d4;
justify-content: center;
align-items: center;

width: 100vw;
height: 100vh;
`

const PixiContainer = styled.div`
    position: absolute;
    overflow: hidden;
    background-color: #ffffff;
    width: 100vw;
    height: 56.25vw;

    max-width: 177.78vh;
    max-height: 100vh;

    canvas {
        width: 100%;
    }
`

class Room extends react.Component{
    constructor(props){
        super(props)
        autoBind(this)
        this.pixiContainer = react.createRef()
    }

    async componentDidMount () {
        const { default: room } = await import("../src/Room")
        const canvas = await room(
            this.props.router.query.roomId,
            this.pixiContainer.current,
            this.props.reduxStore)
        this.props.setCanvas(canvas)
    }

    render() {
        return (
            <Background>
                <PixiContainer
                    onPointerDown={this.props.touchCanvas}
                    onPointerUp={this.props.releaseCanvas}
                    ref={this.pixiContainer} />
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
