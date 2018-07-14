import styled from "styled-components"
import react from "react"

import DownloadPNG from "../static/download.png"
import CameraPNG from "../static/screenshot.png"
import FullScreenPNG from "../static/fullScreen.png"
import ArrowPNG from "../static/backArrow.png"

const Container = styled.div`
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
`

const DownloadContainer = styled(Container)`
    width: 100%;
    height: 50%;
`

const DownloadIMG = styled.img`
    height: 90%;
`
const CameraContainer = styled(Container)`
    width: 100%;
    height: 50%;
`

const CameraIMG = styled.img`
    height: 90%;
`
const FullScreenContainer = styled(Container)`
    width: 50%;
    height: 50%;
`

const FullScreenIMG = styled.img`
    width: 70%;
    transform: translate(5px, 5px);
`
const ArrowContainer = styled(Container)`
    width: 50%;
    height: 100%;
`

const ArrowIMG = styled.img`
    width: 100%;
    ${({invert}) => invert ? "transform: scale(-1, 1);" : ""}
    transition: transform 500ms ease-in-out;
`

export const Download = <DownloadContainer><DownloadIMG src={DownloadPNG} /></DownloadContainer>
export const Camera = <CameraContainer><CameraIMG src={CameraPNG} /></CameraContainer>
export const FullScreen = <FullScreenContainer><FullScreenIMG src={FullScreenPNG} /></FullScreenContainer>
export const Arrow = ({invert}) => <ArrowContainer><ArrowIMG src={ArrowPNG} invert={invert} /></ArrowContainer>
