import { useState } from "react"
import styled from "styled-components"

import LogoSVG from "../assets/svg/C.svg"

import CreateJoinRoom from "../components/CreateJoinRoom"

const Container = styled.div`
    width: 70%;
    height: 100%;
    
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`

const Logo = styled(LogoSVG)`
    align-self: flex-start;
`

const CardLink = styled.a`
    align-self: flex-end;
    text-decoration: none;
`

export default function Index() {
    const [roomId, setRoomId] = useState("")

    return (
        <Container>
            <Logo />
            <CreateJoinRoom
                roomId={roomId}
                onChange={event => 
                    setRoomId(event.target.value.toLowerCase())} />
            <CardLink href="http://marco.mojica.de/">
                Marco Mojica
            </CardLink>
        </Container>
    )
}
