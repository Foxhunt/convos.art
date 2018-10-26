import styled from "styled-components"

const Input = styled.input`
    opacity: 0;
    position: absolute;
    pointer-events: none;
`

const Label = styled.label`
    display: block;
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
            {
                children
            }
        </Label>
    </>
)