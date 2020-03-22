import { useAuthContext } from '../utils/auth'
import { CustomTr, CustomTable, Name } from './CustomTable'

import ViewCodeButton from './ViewCodeButton'
import { ButtonGroup } from 'react-bootstrap'

const SubmissionTable = props => {
	const userData = useAuthContext()
	return (
		<CustomTable>
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Problem</th>
					<th>Result</th>
					<th>Time</th>
					<th>Score</th>
					{userData && <th>Code</th>}
				</tr>
			</thead>
			<tbody>
				{props.results.map((res, index) => (
					<SubTr key={index} {...res} />
				))}
			</tbody>
		</CustomTable>
	)
}

const SubTr = props => {
	const userData = useAuthContext()
	const {
		username,
		name,
		time,
		score,
		result,
		acceptState,
		submitNumber
	} = props

	return (
		<CustomTr {...{ acceptState }}>
			<td>{submitNumber}</td>
			<td>
				<Name>{username}</Name>
			</td>
			<td>{name}</td>
			<td>{result}</td>
			<td>{time} s</td>
			<td>{score}</td>
			{userData && (
				<td>
					<ButtonGroup>
						<ViewCodeButton />
					</ButtonGroup>
				</td>
			)}
		</CustomTr>
	)
}

export default SubmissionTable
