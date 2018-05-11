import react from 'react'
import styled from 'styled-components'
import Nav from '../components/nav'

const Container = styled.div`
    display: flex;
    background-color: #00ff00;
    justify-content: center;
`

export default class Index extends react.Component{

    async componentDidMount () {
        import("../src/game").then(main => {
            window.onload = main.default
        })
    }

    render() {
        return (
                <Container>
                <Nav></Nav>
                    <canvas id="myCanvas" width="960" height="1500"/>
                </Container>
            )
    }
}
