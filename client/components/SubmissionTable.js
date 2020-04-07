import { useState, useEffect } from 'react'
import { useAuthContext } from '../utils/auth'
import { CustomTr, CustomTable, UserTd } from './CustomTable'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components'
import ViewCodeButton from './ViewCodeButton'
import { ButtonGroup } from 'react-bootstrap'
import { CuntomP } from './CustomTable'

const FontPre = styled.pre`
	span,
	code {
		font-family: 'Fira Code', 'Courier New', Courier, monospace;
	}
`

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
	const [show,setShow] = useState(false)
	const { sname, name, timeuse, score, result, idResult } = props
	const isAccept = result => result.split('').every(res => res === 'P')
	const round = num => Math.round(num * 100) / 100
	const canViewCode = (userData, sname) =>
		userData && (userData.state === 0 || userData.sname === sname)

	return (
		<>
			<CustomTr acceptState={isAccept(result)}>
				<td>{idResult}</td>
				<UserTd>{sname}</UserTd>
				<td>{name}</td>
				<td>{(result === 'Compilation Error') && canViewCode(userData, sname) ?
					<CuntomP onClick={() => setShow(true)}>{result}</CuntomP>  : result}</td>
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
			<Modal show={show} onHide={() => setShow(false)} centered size='lg'>
				<Modal.Header closeButton>
					<Modal.Title>Error : {idResult}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FontPre >
						<code>{props.errmsg}</code>
					</FontPre>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default SubmissionTable
