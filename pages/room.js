import react from 'react'
import styled from 'styled-components'
import { withRouter } from 'next/router'

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

    async componentDidMount () {
        import("../src/game").then(main => {
            console.log(this.props.router)
            main.default(this.props.router.query.roomId)
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

export default withRouter(Room)
