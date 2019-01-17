import React from "react"
import styled, { css } from "styled-components"

import { connect } from "react-redux"
import {
    setStrokeStyle,
    setFillStyle,
    setFillImage,
    toggleFillConfig,
    toggleStrokeConfig,
    toggleWebcam
} from "../../../store/actions"

import { hslToHex } from "./colorFunctions"
import ColorPicker from "./colorPicker"

import EllipseStrokeSVG from "../../../static/Ellipse_stroke.svg"
import EllipseFillSVG from "../../../static/Ellipse_fill.svg"
import ArrowSVG from "../../../static/arrow.svg"

import ImgaeUpload from "./imageUpload"
import Button from "./button"

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

const ShapeConfiguration = ({
    fillStyle,
    strokeStyle,
    showFillConfig,
    showStrokeConfig,
    showWebcam,
    setStrokeStyle,
    setFillStyle,
    setFillImage,
    toggleFillConfig,
    toggleStrokeConfig,
    toggleWebcam
}) => {
    const readFile = event => {
        const file = event.currentTarget.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            setFillImage(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const color = showFillConfig ? fillStyle : strokeStyle
    const onColorChange = showFillConfig ?
        ({hsl}) => setFillStyle(hslToHex(hsl.h, hsl.s, hsl.l))
        :
        ({hsl}) => setStrokeStyle(hslToHex(hsl.h, hsl.s, hsl.l))

    return (<>
        <Description>
            <StrokeConfig
                onClick={toggleStrokeConfig}>
                <EllipseStroke
                    stroke={strokeStyle}/>
                <ArrowSVG
                    active={showStrokeConfig.toString()}
                    css={ArrowCSS} />
            </StrokeConfig>
            <FillConfig
                onClick={toggleFillConfig}>
                <EllipseFill
                    fill={fillStyle}/>
                <ArrowSVG
                    active={showFillConfig.toString()}
                    css={ArrowCSS} />
            </FillConfig>
        </Description>
        { (showStrokeConfig || showFillConfig) &&
            <ColorPicker
                color={color}
                onChange={onColorChange}/>
        }
        { showFillConfig &&
            <>
                <ImgaeUpload
                    onChange={readFile}>
                    Image
                </ImgaeUpload>
                <Button
                    backgroundColor={"#C4C4C4"}
                    on={showWebcam}
                    onClick={toggleWebcam}>
                    Webcam
                </Button>
            </>
        }
    </>)
}

const mapStateToProps = state => ({
    fillStyle: state.fillStyle,
    strokeStyle: state.strokeStyle,
    showFillConfig: state.showFillConfig,
    showStrokeConfig: state.showStrokeConfig,
    showWebcam: state.showWebcam
})

const mapDispatchToProps = {
    setStrokeStyle,
    setFillStyle,
    setFillImage,
    toggleFillConfig,
    toggleStrokeConfig,
    toggleWebcam
}

export default connect(mapStateToProps, mapDispatchToProps)(ShapeConfiguration)
