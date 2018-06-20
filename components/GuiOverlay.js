import styled from 'styled-components'
import react from 'react'
import { HuePicker } from "react-color"
import ReactWebcam from "react-webcam"

const Button = styled.div`
	width: 100%;
	height: 5%;

	background-color: #aaaaaa;

	border: 3px solid #000000;
`

const camSize = 40
const Webcam = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	overflow: hidden;

	width: ${camSize}%;
	height: ${camSize*(16/9)}%;

	transform: translate(-50%, -50%);
	
	pointer-events: ${({clickable})=> clickable ? "auto" : "none" };
`

const Img = styled.img`
	width: 100%;
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

	opacity: ${({show}) => show ? 0.9 : 0 };
`

const OptionsDrawer = styled.div`
	pointer-events: ${({clickable})=> clickable ? "auto" : "none" };

	position: absolute;
	left: ${({show}) => show ? 67 : 100 }%;

	transition: left 0.5s ease-in-out;

	overflow: hidden;

	width: 33vw;
	height: 56.25vw;

	max-width: calc(177.78vh / 3);
	max-height: 100vh;

	background-color: #00ffff;
`

const circleSize = 11
const Circle = styled.a`
	position: absolute;
	pointer-events: ${({clickable})=> clickable ? "auto" : "none" };

	transform: translate(-50%, -50%);

	border-radius: 50%;

	width: ${circleSize}%;
	height: ${circleSize*(16/9)}%;

	background-color: #ffffff;
`

const ButtonRight = styled(Circle)`
	top: 50%;
	left: ${({move})=> move ? (100/3*2) : 100 }%;
	transition: left 0.5s ease-in-out;
`

const ButtonRightBot = styled(Circle)`
	top: 100%;
	left: 100%;
`

const ButtonBot = styled(Circle)`
	top: 100%;
	left: 50%;
`

export default class GuiOverlay extends react.Component{

	constructor(props){
		super(props)
		this.fillStyle = "#0000FF"
		this.strokeStyle = "#0000FF"

		this.canvas = null
		this.cam = React.createRef()
		this.image = null

		this.state = {
			showOptions: false,
			showWebcam: false,
			camCapture: null
		}
	}

	componentDidMount(){
		this.canvas = document.getElementById('myCanvas')
	}
	
	render(){
		return (
			<GUI 
				show={this.props.show}>
				<ButtonRight
					clickable={this.props.show}
					move={this.state.showOptions}
					onClick={()=>this.toggleOptionsDrawer()} />
				<OptionsDrawer
					clickable={this.props.show}
					show={this.state.showOptions}>
					<Button
						onClick={() => this.props.brush.Shape = "CIRCLE"}>
						Circle
					</Button>
					<Button
						onClick={() => this.props.brush.Shape = "BOX"}>
						Box
					</Button>
					<Button
						onClick={() => this.props.brush.Shape = "SQUARE"}>
						Square
					</Button>
					Fill
					<HuePicker
						width={"100%"}
						color={this.fillStyle}
						onChange={
							color =>{
								this.props.brush.Fill = color.hex
								this.fillStyle = color.hex
							}
					}/>
					Stroke
					<HuePicker
						width={"100%"}
						color={this.strokeStyle}
						onChange={
							color => {
								this.props.brush.Stroke = color.hex
								this.strokeStyle = color.hex
							}
					}/>
					<Button
						onClick={() => this.setState({showWebcam: !this.state.showWebcam})}>
						toggle Webcam
					</Button>
				</OptionsDrawer>
				{
					this.state.showWebcam && 
					<Webcam>
						<ReactWebcam
							audio={false}
							ref={this.cam} 
							style={{width: `100%`, height: `100%`}}
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

	toggleOptionsDrawer(){
		const showOptions = !this.state.showOptions
		const showWebcam = showOptions ? this.state.showWebcam : false
		this.setState({showOptions, showWebcam})
	}

	takePicture(event){
		if(this.state.showWebcam){
			this.captureWebcam()
		}else{
			this.saveCanvas(event)
		}
	}

	saveCanvas(event){
		const imgURL = this.canvas.toDataURL('image/png')
		event.target.href = imgURL
	}

	captureWebcam(){
		this.props.brush.Image = this.cam.current.getScreenshot()
	}
}

function toggleFullScreen() {
  var doc = window.document
  var docEl = doc.documentElement

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
	requestFullScreen.call(docEl)
  }
  else {
	cancelFullScreen.call(doc)
  }
}

