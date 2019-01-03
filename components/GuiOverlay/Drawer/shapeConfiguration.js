import React, { Component } from "react"
import autoBind from "react-autobind"
import styled, { css } from "styled-components"

import { connect } from "react-redux"
import {
    setStrokeStyle,
    setFillStyle,
    setFillImage,
    toggleFillConfig,
    toggleStrokeConfig
} from "../../../store/actions"

import { hslToHex } from "./colorFunctions"
import ColorPicker from "./colorPicker"

import EllipseStrokeSVG from "../../../static/Ellipse_stroke.svg"
import EllipseFillSVG from "../../../static/Ellipse_fill.svg"
import ArrowSVG from "../../../static/arrow.svg"

import ImgaeUpload from "./imageUpload"

const Description = styled.div`
    height: 13%;

    display: flex;
    align-items: center;
    border-bottom: 1px solid #FFFFFF;
`

const Config = styled.div`
    border-bottom: 1px solid #FFFFFF;
`

const StrokeConfig = styled.div`
    width: 50%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
`

const FillConfig = styled(StrokeConfig)`
    border-left: 1px solid #FFFFFF;
`

const EllipseStroke = styled(EllipseStrokeSVG).attrs(({stroke})=>({
    stroke: stroke
}))`
    height: 57%;
    width: 43%;
    stroke-width: 10;
`

const EllipseFill = styled(EllipseFillSVG).attrs(({fill})=>({
    fill: fill
}))`
    height: 57%;
    width: 43%;
` 

const ArrowCSS = css`
    height: 8%;

    transform: scale(${({active})=> active === "true" ? "1" : "-1"});
`

class ShapeConfiguration extends Component {
    constructor(props) {
        super(props)
        autoBind(this)
    }

    render(){

        const color = this.props.showFillConfig ? this.props.fillStyle : this.props.strokeStyle
        const onColorChange = this.props.showFillConfig ? this.setFillStyle : this.setStrokeStyle

        return <>
            <Description>
                <StrokeConfig
                    onClick={this.props.toggleStrokeConfig}>
                    <EllipseStroke
                        stroke={this.props.strokeStyle}/>
                    <ArrowSVG
                        active={this.props.showStrokeConfig.toString()}
                        css={ArrowCSS} />
                </StrokeConfig>
                <FillConfig
                    onClick={this.props.toggleFillConfig}>
                    <EllipseFill
                        fill={this.props.fillStyle}/>
                    <ArrowSVG
                        active={this.props.showFillConfig.toString()}
                        css={ArrowCSS} />
                </FillConfig>
            </Description>
            { (this.props.showStrokeConfig || this.props.showFillConfig) &&
                <Config>
                        <ColorPicker
                            color={color}
                            onChange={onColorChange}/>
                    {
                        this.props.showFillConfig &&
                        <ImgaeUpload
                            onChange={this.setFillImage}>
                            Image
                        </ImgaeUpload>
                    }
                </Config>
            }
        </>
    }

    setFillImage(event) {
        const file = event.currentTarget.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            this.props.setFillImage(reader.result)
        }
        reader.readAsDataURL(file)
    }
    
    setFillStyle({hsl}) {
            this.props.setFillStyle(hslToHex(hsl.h, hsl.s, hsl.l))
    }

    setStrokeStyle({hsl}) {
            this.props.setStrokeStyle(hslToHex(hsl.h, hsl.s, hsl.l))
    }
}

const mapStateToProps = state => ({
    fillStyle: state.fillStyle,
    strokeStyle: state.strokeStyle,
    showFillConfig: state.showFillConfig,
    showStrokeConfig: state.showStrokeConfig
})

const mapDispatchToProps = {
    setStrokeStyle,
    setFillStyle,
    setFillImage,
    toggleFillConfig,
    toggleStrokeConfig
}

export default connect(mapStateToProps, mapDispatchToProps)(ShapeConfiguration)