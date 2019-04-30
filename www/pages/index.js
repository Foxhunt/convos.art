import React from "react"
import autoBind from "react-autobind"
import styled, { css } from "styled-components"
import Link from "next/link"

import LogoSVG from "../static/C.svg"

import CreateJoinRoom from "../components/CreateJoinRoom"

const Container = styled.div`
    width: 70%;
    height: 100%;
    
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`

const LogoCSS = css`
    align-self: flex-start;
`

const CardLink = styled.a`
    align-self: flex-end;
    text-decoration: none;
`

export default class Index extends React.Component {
    constructor(props) {
        super(props)
        autoBind(this)

        this.state = {
            roomId: ""
        }
    }

    render() {
        return (
            <Container>
                <LogoSVG css={ LogoCSS } />
                <CreateJoinRoom
                    roomId={this.state.roomId}
                    onChange={this.handleInput} />
                <Link href="http://marco.mojica.de" passHref>
                    <CardLink>
                        Marco Mojica
                    </CardLink>
                </Link>
            </Container>
        )
    }

    handleInput(event) {
        this.setState({
            roomId: event.target.value.toLowerCase()
        })
    }
}
