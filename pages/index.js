import react from 'react'
import autoBind from 'react-autobind'
import styled from 'styled-components'
import Link from 'next/link'

import CreateJoinRoom from "../components/CreateJoinRoom"

const Container = styled.div`
    height: 100%;
    
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`

export default class Index extends react.Component {
    constructor(props) {
        super(props)
        autoBind(this)

        this.state = {
            roomId: ''
        }
    }

    render() {
        return (
            <Container>
                <img src="/static/C.svg" />
                <CreateJoinRoom
                    roomId={this.state.roomId}
                    onChange={this.handleInput} />
                <Link href="http://marco.mojica.de">Marco Mojica</Link>
            </Container>
        )
    }

    handleInput(event) {
        this.setState({
            roomId: event.target.value.toLowerCase()
        })
    }
}
