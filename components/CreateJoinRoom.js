import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.form`
    height: 20vh;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`

export default props =>
    <Container>
        Enter a Name to create or join a Room.
        <input
            type='text'
            value={props.roomId}
            onChange={props.onChange} />
        <Link
            prefetch
            href={`/room?roomId=${props.roomId}`}
            as={`/room/${props.roomId}`}>
            <button>Create//Join</button>
        </Link>
    </Container>
