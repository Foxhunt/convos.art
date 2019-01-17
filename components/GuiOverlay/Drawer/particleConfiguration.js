import React, { Component } from "react"
import autoBind from "react-autobind"
import styled, { css } from "styled-components"

import { connect } from "react-redux"
import {
  setParticleColor,
  toggleParticles,
  toggleParticleConfig
} from "../../../store/actions"

import { hslToHex } from "./colorFunctions"
import ColorPicker from "./colorPicker"

import Button from "./button"

import ArrowSVG from "../../../static/arrow.svg"

const Description = styled.div`
    height: 5%;

    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #FFFFFF;
`

const Text = styled.div`
  padding-left: 8%;
`

const ArrowCSS = css`
    height: 19%;

    transform: scale(${({active})=> active === "true" ? "1" : "-1"});
`

class ShapeConfiguration extends Component {
    constructor(props) {
        super(props)
        autoBind(this)
    }

    render(){
        return <>
            <Description
              onClick={this.props.toggleParticleConfig} >
              <Text>Particles</Text>
              <ArrowSVG
                        active={this.props.showParticleConfig.toString()}
                        css={ArrowCSS} />
            </Description>
            { this.props.showParticleConfig &&
                <>
                    <ColorPicker
                        color={this.props.particleColor}
                        onChange={this.setParticleColor}/>
                    <Button
                        on={this.props.particles}
                        onClick={this.props.toggleParticles}>
                        Particles
                    </Button>
                </>
            }
        </>
    }
    
    setParticleColor({hsl}) {
            this.props.setParticleColor(hslToHex(hsl.h, hsl.s, hsl.l))
    }
}

const mapStateToProps = state => ({
  particles: state.particles,
  particleColor: state.particleColor,
  showParticleConfig: state.showParticleConfig
})

const mapDispatchToProps = {
  setParticleColor,
  toggleParticles,
  toggleParticleConfig
}

export default connect(mapStateToProps, mapDispatchToProps)(ShapeConfiguration)