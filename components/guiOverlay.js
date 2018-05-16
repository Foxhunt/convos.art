import styled from 'styled-components'

const GUI = styled.div`
    position: absolute;
    overflow: hidden;
    pointer-events: none;

    width: 100vw;
    height: 56.25vw;

    max-height: 100vh;
    max-width: 177.78vh;
`
const circleSize = 13
const Circle = styled.div`
    position: absolute;
    pointer-events: auto;

    transform: translate(-50%, -50%);

    border-radius: 50%;

    width: ${circleSize}vh;
    height: ${circleSize}vh;

    background-color: #ffffff;
`

const ButtonRight = styled(Circle)`
    top: 50%;
    left: 100%;
`

const ButtonRightBot = styled(Circle)`
    top: 100%;
    left: 100%
`

export default ({width, height}) =>
    <GUI>
            <ButtonRight /> 
            <ButtonRightBot /> 
    </GUI>