import styled from "styled-components"

export default styled.a`
	display: block;

    text-decoration: none;
	:visited, :link, :hover, :active {
		cursor: auto; 
		text-decoration: none;
		color: #000;
	}

	width: 100%;
	height: 5%;

	background-color: ${({on}) => on ? "#00ef00" : "#ef0000" };

	border: 3px solid #000000;
`
