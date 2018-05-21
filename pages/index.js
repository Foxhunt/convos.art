import react from 'react'
import styled from 'styled-components'

import CreateJoinRoom from '../components/CreateJoinRoom'

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100vh;
`

export default class Index extends react.Component{
    render() {
        return (
            <Container>
                <CreateJoinRoom />
            </Container>
        )
    }
}
