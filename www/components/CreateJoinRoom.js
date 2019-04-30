import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.form`
    height: 20vh;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`

export default ({ roomId, onChange }) =>
    <Container>
        Enter a Name to create or join a Room.
        <input
            type='text'
            value={ roomId }
            onChange={ onChange } />
        <Link
            prefetch
            href={`/room?roomId=${ roomId }`}
            as={`/room/${ roomId }`}>
            <button>Create//Join</button>
        </Link>
    </Container>
