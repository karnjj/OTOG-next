import { useState, useEffect } from 'react'
import { useAuthContext } from '../utils/auth'
import { CustomTr, CustomTable, UserTd } from './CustomTable'

import ViewCodeButton from './ViewCodeButton'
import { ButtonGroup } from 'react-bootstrap'

const SubmissionTable = props => {
	const userData = useAuthContext()
	const { results } = props
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
				{results.map((res, index) => (
					<SubTr key={index} {...res} />
				))}
			</tbody>
		</CustomTable>
	)
}

const SubTr = props => {
	const userData = useAuthContext()
	const { sname, name, timeuse, score, result, idResult } = props
	const isAccept = result => result.split('').every(res => res === 'P')
	const round = num => Math.round(num * 100) / 100
	const canViewCode = (userData, sname) =>
		userData && (userData.state === 0 || userData.sname === sname)

	return (
		<CustomTr acceptState={isAccept(result)}>
			<td>{idResult}</td>
			<UserTd>{sname}</UserTd>
			<td>{name}</td>
			<td>{result}</td>
			<td>{timeuse} s</td>
			<td>{round(score)}</td>
			{canViewCode(userData, sname) && (
				<td>
					<ButtonGroup>
						<ViewCodeButton {...{ idResult }} />
					</ButtonGroup>
				</td>
			)}
		</CustomTr>
	)
}

export default SubmissionTable
