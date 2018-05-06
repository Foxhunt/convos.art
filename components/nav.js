import react from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Ul = styled.ul`
    position: fixed;

    width: 100%;
    height: 5vh;
    margin: 0;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: space-around;

    list-style-type: none;
`

export default class NavBar extends react.Component{
    render() {
        return(
                <Ul>
                    <Link prefetch href='one'><li>one</li></Link>
                    <Link prefetch href='two'><li>two</li></Link>
                    <Link prefetch href='three'><li>three</li></Link>
                </Ul>
        )
    }
}
