import { Component } from 'react'
import { CustomPicker } from 'react-color'
import styled from "styled-components"
import { Saturation, Hue } from 'react-color/lib/components/common'

const Container = styled.div`
  height: 4vw;
`

const SaturationDiv = styled.div`
  position: relative;
  width: 100%;
  height: 85%;
`
const HueDiv = styled.div`
  position: relative;
  width: 100%;
  height: 15%;
`

const HuePointer = styled.div`
  height: 0.55vw;
  width: 0.5vw;
  background: white;
  transform: translate(-50%);
`

class MyColorPicker extends Component {
  render() {
    return <Container>
      <SaturationDiv>
        <Saturation
          {...this.props}
          onChange={this.props.onChange} />
      </SaturationDiv>
      <HueDiv>
        <Hue 
          {...this.props}
          pointer={HuePointer}
          onChange={this.props.onChange} />
      </HueDiv>
    </Container>
  }
}

export default CustomPicker(MyColorPicker);