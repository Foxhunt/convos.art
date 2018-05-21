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
            roomId: ''
        }
    }

    handleInput(event){
        this.setState({
            roomId: event.target.value
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
                        prefetch
                        href={`/room?roomId=${this.state.roomId}`}
                        as={`/room/${this.state.roomId}`}>
                        <button>Join//Create</button>
                    </Link>
                </ButtonContainer>
            </Container>
        )
    }
}
