import styled from "styled-components"

const Button = styled.div`
	width: 100%;
	height: 5%;

    padding-left: 8%;
	padding-right: 8%;

    display: flex;
    justify-content: space-between;
    align-items: center;

	border-bottom: 1px solid #ffffff;

	background-color: ${({on, isSubButon}) => on ? "#FF8B8B" : isSubButon ? "#C4C4C4" : "#232323" };
`

const Text = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	${({isSubButon}) => isSubButon ? "color: #232323;" : ""}
`

export default ({on, onClick, children, isSubButon}) =>
	<Button
		isSubButon={ isSubButon }
		on={ on }
		onClick={ onClick }>
		<Text
			isSubButon={ isSubButon }>
			{ children }
		</Text>
	</Button>
