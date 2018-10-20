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

        this.htmlCanvas = react.createRef()
        
        this.state = {
            showGui: true,
            canvas: null
        }

        this.CursorDown = false
    }

    async componentDidMount () {
        const { default: room } = await import("../src/Room")
        this.setState({
            canvas: await room(this.props.router.query.roomId, this.htmlCanvas.current)
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
                    ref={this.htmlCanvas}
                />
                <GuiOverlay 
                    show={this.state.showGui}
                    htmlCanvas={this.htmlCanvas.current}
                    canvas={this.state.canvas}
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
