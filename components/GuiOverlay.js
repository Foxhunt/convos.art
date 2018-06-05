import styled from 'styled-components'
import react from 'react'
import { HuePicker } from "react-color"

const Button = styled.div`
	width: 100%;
	height: 5%;

	background-color: #aaaaaa;

	border: 3px solid #000000;
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
const Circle = styled.div`
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

	font-size: 1.2rem;
`

export default class GuiOverlay extends react.Component{

	constructor(props){
		super(props)
		this.fillStyle = "#0000FF"
		this.strokeStyle = "#0000FF"
		this.state = {
			showOptions: false
		}
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
						onClick={() => this.props.brush.setShape("CIRCLE")}>
						Circle
					</Button>
					<Button
						onClick={() => this.props.brush.setShape("BOX")}>
						Box
					</Button>
					<Button
						onClick={() => this.props.brush.setShape("SQUARE")}>
						Square
					</Button>
					Fill
					<HuePicker
						width={"100%"}
						color={this.fillStyle}
						onChange={
							color =>{
								this.props.brush.fillStyle = color.hex
								this.fillStyle = color.hex
							}
					}/>
					Stroke
					<HuePicker
						width={"100%"}
						color={this.strokeStyle}
						onChange={
							color => {
								this.props.brush.strokeStyle = color.hex
								this.strokeStyle = color.hex
							}
					}/>
				</OptionsDrawer>
				<ButtonRightBot
					clickable={this.props.show}
					onClick={toggleFullScreen} />
			</GUI>
		)
	}

	toggleOptionsDrawer(){
		this.setState({showOptions: !this.state.showOptions})
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

