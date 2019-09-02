import { CustomPicker } from 'react-color'
import styled from "styled-components"
import { Saturation, Hue } from 'react-color/lib/components/common'

const Container = styled.div`
  height: 5vw;
  
	border-bottom: 1px solid #ffffff;
`

const SaturationDiv = styled.div`
  position: relative;
  width: 100%;
  height: 70%;
`
const HueDiv = styled.div`
  position: relative;
  width: 100%;
  height: 30%;
`

const HuePointer = styled.div`
  height: calc(5vw * 0.3);
  width: calc(5vw * 0.3 * 0.9);
  background: #C4C4C4;
  transform: translate(-50%);
`

const MyColorPicker = props =>
  <Container>
    <SaturationDiv>
      <Saturation
        {...props}
        onChange={props.onChange} />
    </SaturationDiv>
    <HueDiv>
      <Hue 
        {...props}
        pointer={HuePointer}
        onChange={props.onChange} />
    </HueDiv>
  </Container>

export default CustomPicker(MyColorPicker);