import styled from "styled-components"

export default styled.div`
	display: block;
	
	width: 100%;
	height: 5%;

	border-bottom: 1px solid #000000;
	border-left: 1px solid #000000;
	border-right: 1px solid #000000;

	background-color: ${({on}) => on ? "#00dc00" : "#e80000" };

	:visited, :link, :hover, :active {
		cursor: auto; 
		text-decoration: none;
		color: #000;
	}

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`
