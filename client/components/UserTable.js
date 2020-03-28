import styled from 'styled-components'
import vars from '../styles/vars'
import { CustomTable, UserTd } from './CustomTable'

const UserTable = props => (
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
			{props.users.map((user, index) => (
				<tr key={index}>
					<td>{index + 1}</td>
					<UserTd score={user.rating}>{user.sname}</UserTd>
					<td>{user.rating}</td>
					<td>0</td>
				</tr>
			))}
		</tbody>
	</CustomTable>
)

export default UserTable
