import styled from "styled-components"

const Button = styled.div`
	width: 100%;
	height: 5%;

	padding-left: 8%;

    display: flex;
    justify-content: space-between;
    align-items: center;

	border-bottom: 1px solid #ffffff;

	background-color: ${({on, backgroundColor}) => on ? "#FF8B8B" : backgroundColor };
`

const Text = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	${({isSubButon}) => isSubButon ? "color: #232323;" : ""}
`

export default ({on, onClick, children, backgroundColor = "#232323"}) => (
	<Button
		backgroundColor={ backgroundColor }
		on={ on }
		onClick={ onClick }>
		<Text
			isSubButon={ backgroundColor !== "#232323" }>
			{ children }
		</Text>
	</Button>
)
