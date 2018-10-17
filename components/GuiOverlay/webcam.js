import ReactWebcam from "react-webcam"
import styled from 'styled-components'

const camSize = 40
const Webcam = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	overflow: hidden;

	width: ${camSize}%;
	height: ${camSize * (16 / 9)}%;

	transform: translate(-50%, -50%);
	
	pointer-events: ${({ clickable }) => clickable ? "auto" : "none"};
`

export default ({innerRef}) =>
    <Webcam>
        <ReactWebcam
            audio={false}
            ref={ innerRef }
            style={{ width: `100%`, height: `100%` }} />
    </Webcam>
