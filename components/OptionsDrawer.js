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

export default ({ clickable, canvas, toggleWebcam, setDraggable }) =>
    <Container
        onPointerDown={() => setDraggable(false)}
        onPointerUp={() => setDraggable(true)}
        clickable={clickable}>
        <Button
            onClick={() => canvas.ownBrush.Shape = "CIRCLE"}>
            Circle
					</Button>
        <Button
            onClick={() => canvas.ownBrush.Shape = "BOX"}>
            Box
					</Button>
        <Button
            onClick={() => canvas.ownBrush.Shape = "SQUARE"}>
            Square
					</Button>
        Fill
					<HuePicker
            width={"100%"}
            color={this.fillStyle}
            onChange={
                color => {
                    canvas.ownBrush.Fill = color.hex
                    this.fillStyle = color.hex
                }
            } />
        Stroke
					<HuePicker
            width={"100%"}
            color={this.strokeStyle}
            onChange={
                color => {
                    canvas.ownBrush.Stroke = color.hex
                    this.strokeStyle = color.hex
                }
            } />
        Particles
					<HuePicker
            width={"100%"}
            color={this.particleCollor}
            onChange={
                color => {
                    canvas.particles.particleColor = color.hex
                    this.particleCollor = color.hex
                }
            } />
        <Button
            onClick={() => canvas.particles.enabled = !canvas.particles.enabled}>
            toggle Particles
        </Button>
        <Button
            onClick={toggleWebcam}>
            toggle Webcam
        </Button>
    </Container>
