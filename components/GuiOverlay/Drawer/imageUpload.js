import styled from "styled-components"

const Input = styled.input`
    opacity: 0;
    position: absolute;
    pointer-events: none;
`

const Label = styled.label`
    width: 100%;
    height: 5%;
    
    padding-left: 8%;

    display: flex;
    justify-content: space-between;
    align-items: center;

	border-bottom: 1px solid #ffffff;

	background-color: #C4C4C4;
`

const Text = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

    color: #232323;
`

export default ({ onChange, children, id =`upLd${Math.random()}` }) =>
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
