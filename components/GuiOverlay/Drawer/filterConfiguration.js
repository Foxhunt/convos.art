import React, {useEffect, useState} from "react"
import styled, { css } from "styled-components"

import { connect } from "react-redux"
import { 
    toggleFilterConfig,
    toggleFilter
 } from "../../../store/actions"

import Button from "./button"
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
    showFilterConfig,
    toggleFilterConfig,
    toggleFilter,
    filters
}) => {

    const [AlphaFilter, setAlphaFilter] = useState()
    const loadAlphaFilter = async () => {
        const {default: AlphaFilter} = await import("../../../src/AlphaFilter")
        setAlphaFilter(new AlphaFilter(0.02))
    }

    const [PixelateFilter, setPixelateFilter] = useState()
    const loadAsciiFilter = async () => {
        const { PixelateFilter } = await import("pixi-filters")
        setPixelateFilter(new PixelateFilter(5))
    }

    useEffect(() => {
        loadAlphaFilter()
        loadAsciiFilter()
    }, [])

    return <>
        <Description
            onClick={toggleFilterConfig} >
            <Text>Filters</Text>
            <ArrowSVG
                active={showFilterConfig.toString()}
                css={ArrowCSS} />
        </Description>
        { showFilterConfig && <>
            <Button
                isSubButon
                on={filters.includes(AlphaFilter)}
                onClick={() => toggleFilter(AlphaFilter)}>
                Alpha
            </Button>
            <Button
                isSubButon
                on={filters.includes(PixelateFilter)}
                onClick={() => toggleFilter(PixelateFilter)}>
                Pixelate
            </Button>
        </> }
    </>
}

const mapStateToProps = state => ({
    showFilterConfig: state.showFilterConfig,
    filters: state.filters
})

const mapDispatchToProps = {
    toggleFilterConfig,
    toggleFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(ShapeConfiguration)