import React, { Component } from "react"
import autoBind from "react-autobind"
import styled, { css } from "styled-components"

import { connect } from "react-redux"
import { 
    setStrokeStyle,
    setFillStyle,
    setFillImage } from "../../../store/actions"

import { HuePicker } from "react-color"
import { hslToHex } from "./colorFunctions"

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

const ShapeCSS = css`
    height: 57%;
    width: 43%;
`

const ArrowCSS = css`
    height: 8%;

    transform: scale(${({active})=>active ? "-1" : "1"});
`

const Config = styled.div`

`

class ShapeConfiguration extends Component {
    constructor(props) {
        super(props)
        autoBind(this)
    }

    render(){
        return <>
            <Description>
                <StrokeConfig>
                    <EllipseStrokeSVG
                        css={ShapeCSS} />
                    <ArrowSVG
                        active
                        css={ArrowCSS} />
                </StrokeConfig>
                <FillConfig>
                    <EllipseFillSVG
                        css={ShapeCSS} />
                    <ArrowSVG
                        active
                        css={ArrowCSS} />
                </FillConfig>
            </Description>
            <Config>
                <HuePicker 
                    width={"100%"}
                    color={this.props.fillStyle}
                    onChange={this.setFillStyle} />
                <ImgaeUpload 
                    onChange={this.setFillImage}>
                Image
                </ImgaeUpload>
            </Config>
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
    strokeStyle: state.strokeStyle
})

const mapDispatchToProps = {
    setStrokeStyle,
    setFillStyle,
    setFillImage
}

export default connect(mapStateToProps, mapDispatchToProps)(ShapeConfiguration)