import ReactWebcam from "react-webcam"
import styled from 'styled-components'

const camSize = 40
const Webcam = styled(ReactWebcam)`
	position: absolute;
	top: 50%;
	left: 50%;
	overflow: hidden;

	width: ${camSize}%;
	height: ${camSize * (16 / 9)}%;

	transform: translate(-50%, -50%);
	
	pointer-events: none;
`

export default Webcam
