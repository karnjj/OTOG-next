import { Table } from 'react-bootstrap'
import styled from 'styled-components'
import vars from '../styles/vars'

const Tr = styled.tr`
    color: ${vars.orange};
`
const CenteredTable = styled(Table)`
    text-align: center;
`
const ColoredName = styled.td`
    color: ${props => {
        if (props.score >= 2000) {
            return vars.grandmaster
        } else if (props.score >= 1800) {
            return vars.master 
        } else {
            return vars.regular
        }
    }};
`

const UserTable = (props) => (
    <CenteredTable hover responsive>
        <thead>
            <Tr>
                <th>#</th>
                <th>Name</th>
                <th>Rating</th>
                <th>Passed</th>
            </Tr>
        </thead>
        <tbody>
        {props.user.map((user, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <ColoredName score={user.rating}>{user.sname}</ColoredName>
                <td>{user.rating}</td>
                <td>0</td>
            </tr>
        ))}
        </tbody>
    </CenteredTable>
)

export default UserTable