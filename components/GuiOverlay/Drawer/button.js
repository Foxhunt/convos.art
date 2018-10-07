import styled from "styled-components"

export default styled.div`
	width: 100%;
	height: 5%;

	background-color: ${({on}) => on ? "#00ef00" : "#ef0000" };

	border: 3px solid #000000;
`
