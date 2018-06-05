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
    constructor(props){
        super(props)

        this.state = {
            showGui: true
        }

        this.CursorDown = false
        this.brush = null
    }

    async componentDidMount () {
        import("../src/game").then(async game => {
            this.brush = await game.default(this.props.router.query.roomId)
        })
    }

    render() {
        return (
            <Background>
                <Canvas
                    id="myCanvas"
                    width="1920"
                    height="1080"
                    onMouseDown={() => this.onCursorDown()}
                    onMouseMove={() => this.onCursorMove()}
                    onMouseUp={() => this.onCursorUp()}
                    onTouchStart={() => this.onCursorDown()}
                    onTouchMove={() => this.onCursorMove()}
                    onTouchEnd={() => this.onCursorUp()}
                />
                <GuiOverlay 
                    show={this.state.showGui}
                    brush={this.brush}
                />
            </Background>
        )
    }

    onCursorDown(){
        this.CursorDown = true
        this.hideGui()
    }

    onCursorUp(){
        this.CursorDown = false
        this.hideGui()
    }

    onCursorMove(){
        if(this.CursorDown){
            this.hideGui()
        }
    }

    hideGui(){
        this.setState({showGui: !this.CursorDown})
    }

}

export default withRouter(Room)
