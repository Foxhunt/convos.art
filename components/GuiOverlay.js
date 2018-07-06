import styled from 'styled-components'
import react from 'react'
import ReactWebcam from "react-webcam"
import Draggable from "react-draggable"

import OptionsDrawer from "./OptionsDrawer"
import Circle from "./DivCircle"

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

const DragWraper = styled.div`
	width: 100%;
	height: 100%;
	
	${({isDragging}) => isDragging ? "" : "transition: transform 0.5s ease-in-out;"}
`

const GUI = styled.div`
	position: absolute;
	overflow: hidden;
	pointer-events: none;

	width: 100vw;
	height: 56.25vw;

	max-width: 177.78vh;
	max-height: 100vh;

	transition: opacity 0.5s ease-in-out;

	opacity: ${({ show }) => show ? 0.9 : 0};
`

const ButtonRight = styled(Circle)`
	position: absolute;
	top: 50%;
	left: 100%;
`

const ButtonRightBot = styled(Circle)`
	top: 100%;
	left: 100%;
`

const ButtonBot = styled(Circle)`
	top: 100%;
	left: 50%;
`

export default class GuiOverlay extends react.Component {
	constructor(props) {
		super(props)
		this.fillStyle = "#0000FF"
		this.strokeStyle = "#0000FF"

		this.canvas = null
		this.cam = React.createRef()

		this.isDragging = false
		this.dragDirection = ""

		this.state = {
			showWebcam: false,
			showOptionsDrawer: false,
			camCapture: null,
		}
	}

	componentDidMount() {
		this.canvas = document.getElementById('myCanvas')
		this.showOptionsDrawerPos = { x: -window.innerWidth*0.33, y: 0 }
		this.hideOptionsDrawerPos = { x: 0, y: 0 }
	}

	render() {
		return (
			<GUI
				show={this.props.show}>
				<Draggable
					axis="x"
					onDrag={(event, data) => this.handleDrag(event, data)}
					onStop={(event, data) => this.handleDragStop(event, data)}
					position={this.state.showOptionsDrawer ? this.showOptionsDrawerPos : this.hideOptionsDrawerPos}>
					<DragWraper
						isDragging={this.state.isDragging}>
						<ButtonRight
							clickable={this.props.show}
							onClick={() => this.toggleOptionsDrawer()} />
						<OptionsDrawer
							clickable={this.props.show}
							brush={this.props.brush}
							toggleWebcam={() => this.toggleWebcam()} />
					</DragWraper>
				</Draggable>
				{
					this.state.showWebcam &&
					<Webcam>
						<ReactWebcam
							audio={false}
							ref={this.cam}
							style={{ width: `100%`, height: `100%` }}
						/>
					</Webcam>
				}
				<ButtonRightBot
					clickable={this.props.show}
					onClick={toggleFullScreen} />
				<ButtonBot
					clickable={this.props.show}
					onClick={event => this.takePicture(event)}
					download='canvas' />
			</GUI>
		)
	}

	handleDrag(event, data){
		this.setState({ isDragging: true })
		if(data.deltaX > 5){
			this.dragDirection = "right"
		}
		if(data.deltaX < -5){
			this.dragDirection = "left"
		}
	}

	handleDragStop(event, data){
		console.log(data.deltaX)
		if(this.dragDirection === "right"){
			this.setState({ showOptionsDrawer: false })
		}
		if(this.dragDirection === "left"){
			this.setState({ showOptionsDrawer: true })
		}
		this.dragDirection = ""

		setTimeout(() => {
			this.setState({ isDragging: false })
		}, 100)
	}

	toggleOptionsDrawer() {
		if(!this.state.isDragging){
			this.setState({ showOptionsDrawer: !this.state.showOptionsDrawer })
		}
	}

	toggleWebcam() {
		this.setState({
			showWebcam: !this.state.showWebcam
		})
	}

	takePicture(event) {
		if (this.state.showWebcam) {
			event.preventDefault()
			this.captureWebcam()
		} else {
			this.saveCanvas(event)
		}
	}

	saveCanvas(event) {
		const imgURL = this.canvas.toDataURL('image/jpeg')
		event.target.href = imgURL
	}

	captureWebcam() {
		this.props.brush.Image = this.cam.current.getScreenshot()
	}
}

function toggleFullScreen() {
	var doc = window.document
	var docEl = doc.documentElement

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

	if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl)
		window.screen.orientation.lock("landscape").catch(err => console.error(err))
	}
	else {
		cancelFullScreen.call(doc)
	}
}

