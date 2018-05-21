import styled from 'styled-components'

const GUI = styled.div`
    position: absolute;
    overflow: hidden;
    pointer-events: none;

    width: 100vw;
    height: 56.25vw;

    max-height: 100vh;
    max-width: 177.78vh;
`
const circleSize = 13
const Circle = styled.div`
    position: absolute;
    pointer-events: auto;

    transform: translate(-50%, -50%);

    border-radius: 50%;

    width: ${circleSize}%;
    height: ${circleSize*(16/9)}%;

    background-color: #ffffff;
`

const ButtonRight = styled(Circle)`
    top: 50%;
    left: 100%;
`

const ButtonRightBot = styled(Circle)`
    top: 100%;
    left: 100%
`

export default () =>
    <GUI>
            <ButtonRight /> 
            <ButtonRightBot
                onClick={toggleFullScreen}
             /> 
    </GUI>

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
