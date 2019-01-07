import styled from "styled-components"

const Input = styled.input`
    opacity: 0;
    position: absolute;
    pointer-events: none;
`

const Label = styled.label`
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    height: 100%;

    padding-left: 8%;
	width: 100%;
	height: 5%;

	border-bottom: 1px solid #000000;
	border-left: 1px solid #000000;
	border-right: 1px solid #000000;

	background-color: #C4C4C4;
`

const Text = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

    color: #232323;
`

export default ({ onChange, children, id =`upLd${Math.random()}` }) => (
    <>
        <Input
            id={id}
            type="file"
            accept="image/*"
            onChange={onChange} />
        <Label 
            htmlFor={id}>
            <Text>
                { children }
            </Text>
        </Label>
    </>
)