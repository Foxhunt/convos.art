import react from 'react'
import autoBind from 'react-autobind'
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
        autoBind(this)

        this.state = {
            showGui: true,
            brush: null
        }

        this.CursorDown = false
    }

    async componentDidMount () {
        import("../src/game").then(async game => {
            this.setState({ brush: await game.default(this.props.router.query.roomId) })
        })
    }

    render() {
        return (
            <Background>
                <Canvas
                    id="myCanvas"
                    width="1920"
                    height="1080"
                    onPointerDown={this.onCursorDown}
                    onPointerMove={this.onCursorMove}
                    onPointerUp={this.onCursorUp}
                />
                <GuiOverlay 
                    show={this.state.showGui}
                    brush={this.state.brush}
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
