import styled from 'styled-components'
import vars from '../styles/vars'
import { CustomTable } from './CustomTable'

const Nametd = styled.td`
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
    <CustomTable>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Rating</th>
                <th>Passed</th>
            </tr>
        </thead>
        <tbody>
        {props.user.map((user, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <Nametd score={user.rating}>{user.sname}</Nametd>
                <td>{user.rating}</td>
                <td>0</td>
            </tr>
        ))}
        </tbody>
    </CustomTable>
)

export default UserTable