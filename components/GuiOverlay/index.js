import React, { Component } from 'react'
import autoBind from 'react-autobind'
import styled from 'styled-components'

import { connect } from "react-redux"
import { toggleDrawer, setDrawer, toggleWebcam } from "../../store/actions"

import Draggable from "react-draggable"

import OptionsDrawer from "./Drawer"
import Webcam from "./webcam"
import Button from "./overlayButton"

import toggleFullScreen from "./toggleFullScreen"

import * as PNGS from "./PNGS"

const DragWraper = styled.div`
	width: 100%;
	height: 100%;
	
	${({ isDragging }) => isDragging ? "" : "transition: transform 0.5s ease-in-out;"}
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

const ButtonRight = styled(Button)`
	position: absolute;
	top: 50%;
	left: 100%;
`

const ButtonRightBot = styled(Button)`
	top: 100%;
	left: 100%;
`

const ButtonBot = styled(Button)`
	top: 100%;
	left: 50%;
`

class GuiOverlay extends Component {
	constructor(props) {
		super(props)
		autoBind(this)

		this.fillStyle = "#0000FF"
		this.strokeStyle = "#0000FF"

		this.camRef = React.createRef()

		this.dragDirection = ""

		this.hideDrawerPos = { x: 0, y: 0 }
		this.showDrawerPos = { x: 0, y: 0 }
		this.dragBounds = { left: 0, right: 0 }

		this.state = {
			drawerPos: null,
			camCapture: null,
			isDragging: false,
			draggable: true,
			dragAt: 0
		}
	}

	calculatepositions() {
		this.showDrawerPos = { x: -this.props.canvas.htmlCanvas.offsetWidth * 0.20, y: 0 }
		this.hideDrawerPos = { x: 0, y: 0 }
		this.dragBounds = {
			left: this.showDrawerPos.x,
			right: this.hideDrawerPos.x
		}
		this.setState({ drawerPos: this.hideDrawerPos })
	}

	componentDidMount() {
		window.addEventListener("resize", this.calculatepositions)
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.calculatepositions)
	}

	componentDidUpdate() {
		this.props.canvas.htmlCanvas && !this.state.drawerPos && this.calculatepositions()
	}

	render() {
		return (
			<GUI
				show={this.props.showGui}>
				<Draggable
					disabled={!this.state.draggable}
					axis="x"
					onDrag={this.handleDrag}
					onStop={this.handleDragStop}
					position={this.state.drawerPos}
					bounds={this.dragBounds}>
					<DragWraper
						isDragging={this.state.isDragging}>
						<ButtonRight
							clickable={this.props.showGui}>
							<PNGS.Arrow
								invert={this.state.dragAt}
								isDragging={this.state.isDragging}/>
						</ButtonRight>
						<OptionsDrawer
							setDraggable={this.setDraggable} />
					</DragWraper>
				</Draggable>
				{ this.props.showWebcam && <Webcam ref={ this.camRef } /> }
				<ButtonRightBot
					clickable={this.props.showGui}
					onClick={toggleFullScreen}>
					{PNGS.FullScreen}
				</ButtonRightBot>
				<ButtonBot
					clickable={this.props.showGui}
					onClick={this.takePicture}
					download='canvas'>
					{
						this.props.showWebcam ?
							PNGS.Camera
							:
							PNGS.Download
					}
				</ButtonBot>
			</GUI>
		)
	}

	setDraggable(state) {
		this.setState({ draggable: state })
	}

	handleDrag(event, data) {
		if (!this.state.isDragging) {
			this.setState({ isDragging: true })
		}
		if (data.deltaX != 0) {
			this.dragDirection = data.deltaX
		}
		this.setState({ dragAt: data.x / this.showDrawerPos.x })
	}

	handleDragStop(event) {
		this.setState({ isDragging: false })
		if (this.dragDirection > 0) {
			this.dragDirection = 0
			this.props.setDrawer(false)
			return this.showOptionsDrawer(false)
		}
		if (this.dragDirection < 0) {
			this.dragDirection = 0
			this.props.setDrawer(true)
			return this.showOptionsDrawer(true)
		}
		if (this.dragDirection == 0 && event.type == "mouseup") {
			this.showOptionsDrawer(!this.props.showDrawer)
			this.props.setDrawer(!this.props.showDrawer)
		}
	}

	showOptionsDrawer(state) {
		this.setState({
			drawerPos:
				state ?
					this.showDrawerPos
					:
					this.hideDrawerPos,
			dragAt: state ? 1 : 0
		})
	}

	takePicture(event) {
		if (this.props.showWebcam) {
			event.preventDefault()
			this.captureWebcam()
		} else {
			this.captureCanvas(event)
		}
	}

	captureCanvas(event) {
		const imgURL = this.props.canvas.htmlCanvas.toDataURL('image/png')
		event.target.href = imgURL
		this.props.setDrawer(false)
	}

	captureWebcam() {
		this.props.canvas.ownBrush.Image = this.camRef.current.getScreenshot()
		this.props.toggleWebcam()
		this.props.setDrawer(false)
	}
}

const mapStateToProps = state => ({
	showGui: state.showGui,
	showDrawer: state.showDrawer,
	showWebcam: state.showWebcam,
	canvas: state.canvas,
})

const mapDispatchToProps = {
	toggleDrawer,
	toggleWebcam,
	setDrawer,
}

export default connect(mapStateToProps, mapDispatchToProps)(GuiOverlay)
