import React, { Component } from 'react'
import autoBind from 'react-autobind'
import styled from 'styled-components'

import { connect } from "react-redux"
import { toggleDrawer, setDrawer, toggleWebcam, setFillImage } from "../../store/actions"

import OptionsDrawer from "./Drawer"
import Webcam from "./webcam"
import Button from "./overlayButton"

const GUI = styled.div`
	position: absolute;
	overflow: hidden;
	pointer-events: none;

	width: 100vw;
	height: 56.25vw;

	max-width: 177.78vh;
	max-height: 100vh;

	opacity: ${({ show }) => show ? 1 : 0};
	transition: opacity 0.4s ease-out;
	will-change: opacity;
`

const ActionButton = styled(Button)`
	top: 90%;
	left: 90%;
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
		this.showDrawerPos = { x: -this.props.canvas.pixiContainer.offsetWidth * 0.20, y: 0 }
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
		this.props.canvas.app.view && !this.state.drawerPos && this.calculatepositions()
	}

	render() {
		return (
			<GUI
				show={this.props.showGui}>
				<OptionsDrawer />
				{ this.props.showWebcam && <Webcam ref={ this.camRef } /> }
				<ActionButton
					clickable={this.props.showGui}
					onClick={this.action} />
			</GUI>
		)
	}

	action() {
		if( this.props.showWebcam ){
			this.captureWebcam()
		} else {
			this.props.toggleDrawer()
		}
	}

	captureWebcam() {
		this.props.setFillImage(this.camRef.current.getScreenshot())
		this.props.toggleWebcam()
		this.props.setDrawer(false)
	}
}

const mapStateToProps = state => ({
	showGui: state.showGui,
	showWebcam: state.showWebcam,
	canvas: state.canvas,
})

const mapDispatchToProps = {
	toggleDrawer,
	toggleWebcam,
	setDrawer,
	setFillImage
}

export default connect(mapStateToProps, mapDispatchToProps)(GuiOverlay)
