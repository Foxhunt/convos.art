import React from "react"
import styled, { css } from "styled-components"
import EllipseSVG from "../../../static/Ellipse.svg"
import RectangleSVG from "../../../static/Rectangle.svg"
import Rectangle2SVG from "../../../static/Rectangle 2.svg"


const Container = styled.div`
    height: 10%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: 1px solid #FFFFFF;
`

const shapeStyle = css`
    height: 44%;

    fill: ${({on})=> on === "true" ? "#FF8B8B" : "#C4C4C4"};
`

export default ({shapeType, setShapeType}) =>
  <Container>
    <RectangleSVG
        css={shapeStyle}
        on={(shapeType === "SQUARE").toString()}
        onClick={() => setShapeType("SQUARE")} />
    <EllipseSVG
        css={shapeStyle}
        on={(shapeType === "CIRCLE").toString()}
        onClick={() => setShapeType("CIRCLE")} />
    <Rectangle2SVG
        css={shapeStyle}
        on={(shapeType === "BOX").toString()}
        onClick={() => setShapeType("BOX")} />
  </Container>
