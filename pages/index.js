import react from 'react'
import styled from 'styled-components'

import GuiOverlay from '../components/guiOverlay'

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

export default class Index extends react.Component{

    async componentDidMount () {
        import("../src/game").then(main => {
            window.onload = main.default
        })
    }

    render() {
        return (
                <Background>
                    <Canvas id="myCanvas" width="1920" height="1080"/>
                    <GuiOverlay />
                </Background>
            )
    }
}
