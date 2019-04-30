import React from "react"
import styled from "styled-components"

const Outer = styled.div`
    width: 5%;
    height: calc(5% * 6.948717948717949);
    border: 2px red solid;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
`

const Inner = styled.div`
    width: 50%;
    height: 50%;
    background-color: red;
    border-radius: 50%;
`

export default ({ on, onClick }) =>
    <Outer
        onClick={ event => {
            event.stopPropagation()
            onClick()
        }}>
        { on && <Inner /> }
    </Outer>
