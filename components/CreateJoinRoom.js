import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100vh;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
`

export default () => 
    <Container>
        <div>
            <input type='text' />
            <ButtonContainer>
                <button>Join</button>
                <button>Create</button>
            </ButtonContainer>
        </div>
    </Container>