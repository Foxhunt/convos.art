import styled from "styled-components"
import react from "react"

import DownloadPNG from "../static/download.png"
import CameraPNG from "../static/screenshot.png"
import FullScreenPNG from "../static/fullScreen.png"
import ArrowPNG from "../static/backArrow.png"

const DownloadContainer = styled.div`
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const DownloadIMG = styled.img`
    height: 90%;
`
const CameraContainer = styled.div`
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const CameraIMG = styled.img`
    height: 90%;
`
const FullScreenContainer = styled.div`
    width: 50%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const FullScreenIMG = styled.img`
    width: 70%;
    transform: translate(5px, 5px);
`
const ArrowContainer = styled.div`
    pointer-events: none;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ArrowIMG = styled.img`
    pointer-events: none;
    width: 100%;
    ${({invert}) => invert ? "transform: scale(-1, 1);" : ""}
    transition: transform 500ms ease-in-out;
`

export const Download = <DownloadContainer><DownloadIMG src={DownloadPNG} /></DownloadContainer>
export const Camera = <CameraContainer><CameraIMG src={CameraPNG} /></CameraContainer>
export const FullScreen = <FullScreenContainer><FullScreenIMG src={FullScreenPNG} /></FullScreenContainer>
export const Arrow = ({invert}) => <ArrowContainer><ArrowIMG src={ArrowPNG} invert={invert} /></ArrowContainer>
