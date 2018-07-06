import styled from 'styled-components'

const circleSize = 11
export default styled.a`
	position: absolute;
	pointer-events: ${({clickable})=> clickable ? "auto" : "none" };

	transform: translate(-50%, -50%);

	border-radius: 50%;

	width: ${circleSize}%;
	height: ${circleSize*(16/9)}%;

	background-color: #ffffff;
`
