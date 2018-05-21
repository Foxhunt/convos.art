import react from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
    height: 20vh;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`

const ButtonContainer = styled.div`
    width: 100%;

    display: flex;
    justify-content: space-around;
`

export default class CreateJoinRoom extends react.Component{
    constructor(props){
        super(props)

        this.state = {
            roomName: ''
        }
    }

    handleInput(event){
        this.setState({
            roomName: event.target.value
        })
    }
    
    render(){
        return (
            <Container>
                <label>
                    {'Room '}
                    <input
                    type='text'
                    onChange={event => this.handleInput(event)}/>
                </label>
                <ButtonContainer>
                    <Link 
                        href={`/room?name=${this.state.roomName}`}
                        as={`/room/${this.state.roomName}`}>
                        <button>Join//Create</button>
                    </Link>
                </ButtonContainer>
            </Container>
        )
    }
}
