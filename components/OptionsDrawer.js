import styled from 'styled-components'
import { HuePicker } from "react-color"


const Container = styled.div`
	pointer-events: ${({ clickable }) => clickable ? "auto" : "none"};

	position: absolute;
	left: 100%;

	overflow: hidden;

	width: 33vw;
	height: 56.25vw;

	max-width: calc(177.78vh / 3);
	max-height: 100vh;

	background-color: #00ffff;
`

const Button = styled.div`
	width: 100%;
	height: 5%;

	background-color: #aaaaaa;

	border: 3px solid #000000;
`

export default ({ clickable, brush, toggleWebcam, setDraggable }) =>
    <Container
        onPointerDown={() => setDraggable(false)}
        onPointerUp={() => setDraggable(true)}
        clickable={clickable}>
        <Button
            onClick={() => brush.Shape = "CIRCLE"}>
            Circle
					</Button>
        <Button
            onClick={() => brush.Shape = "BOX"}>
            Box
					</Button>
        <Button
            onClick={() => brush.Shape = "SQUARE"}>
            Square
					</Button>
        Fill
					<HuePicker
            width={"100%"}
            color={this.fillStyle}
            onChange={
                color => {
                    brush.Fill = color.hex
                    this.fillStyle = color.hex
                }
            } />
        Stroke
					<HuePicker
            width={"100%"}
            color={this.strokeStyle}
            onChange={
                color => {
                    brush.Stroke = color.hex
                    this.strokeStyle = color.hex
                }
            } />
        <Button
            onClick={toggleWebcam}>
            toggle Webcam
        </Button>
    </Container>
