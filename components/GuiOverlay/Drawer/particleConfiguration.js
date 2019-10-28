import React from "react"
import styled, { css } from "styled-components"

import { connect } from "react-redux"
import {
  setParticleColor,
  toggleParticles,
  toggleParticleConfig
} from "../../../store/actions"

import { hslToHex } from "./colorFunctions"
import ColorPicker from "./colorPicker"

import RadioButton from "./radioButton"

import ArrowSVG from "../../../assets/svg/arrow.svg"

const Description = styled.div`
    height: 5%;

    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #FFFFFF;
    padding-left: 8%;
    padding-right: 8%;
`

const Text = styled.div`
    width: 55%;
`

const ArrowCSS = css`
    height: 19%;

    transform: scale(${({active})=> active === "true" ? "1" : "-1"});
`

const ShapeConfiguration = ({
    particles,
    particleColor,
    showParticleConfig,
    setParticleColor,
    toggleParticles,
    toggleParticleConfig
}) =>
    <>
        <Description
            onClick={toggleParticleConfig} >
            <Text>Particles</Text>
            <RadioButton
                on={ particles }
                onClick={ toggleParticles }/>
            <ArrowSVG
                active={showParticleConfig.toString()}
                css={ArrowCSS} />
        </Description>
        { showParticleConfig &&
            <ColorPicker
                color={particleColor}
                onChange={({hsl}) => setParticleColor(hslToHex(hsl.h, hsl.s, hsl.l))}/>
        }
    </>

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