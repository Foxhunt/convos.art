import { useRef, useEffect } from 'react'
import styled from 'styled-components'

import { connect } from "react-redux"
import { touchCanvas, releaseCanvas, setCanvas } from "../../store/actions"

import GuiOverlay from '../../components/GuiOverlay'

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

function Room(props){
    const pixiContainer = useRef()

    useEffect(() => {
        async function setupRoom() {
            const { default: room } = await import("../../src/Room")
            const canvas = await room(
                props.roomId,
                pixiContainer.current,
                props.reduxStore
            )
            props.setCanvas(canvas)
        }
        setupRoom()
    }, [])

    return (
        <Background>
            <PixiContainer
                onPointerDown={props.touchCanvas}
                onPointerUp={props.releaseCanvas}
                ref={pixiContainer} />
            <GuiOverlay />
        </Background>
    )
}

Room.getInitialProps = ({ query }) => {
    return { roomId: query.roomId }
}

const mapDispatchToProps = {
    touchCanvas,
    releaseCanvas,
    setCanvas
}

export default connect(undefined, mapDispatchToProps)(Room)
