import { useState, useEffect } from 'react'
import { useAuthContext } from '../utils/auth'

import { CustomTr, CustomTable, UserTd } from './CustomTable'
import { Modal, ButtonGroup } from 'react-bootstrap'
import ViewCodeButton from './ViewCodeButton'

import styled from 'styled-components'
import prism from 'prismjs'

const FontPre = styled.pre`
	span,
	code {
		font-family: 'Fira Code', 'Courier New', Courier, monospace;
	}
`

const SubmissionTable = (props) => {
	const userData = useAuthContext()
	const { results } = props
	return (
		<CustomTable ready={results.length}>
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

const SubTr = (props) => {
	const userData = useAuthContext()
	const [showError, setShowError] = useState(false)
	const { sname, name, timeuse, score, result, idResult, errmsg } = props

	const handleShow = () => setShowError(true)
	const handleClose = () => setShowError(false)
	const isAccept = (result) =>
		result
			.split('')
			.filter((res) => res !== '[' && res !== ']')
			.every((res) => res === 'P')
	const round = (num) => Math.round(num * 100) / 100
	const canViewCode = (userData, sname) =>
		userData && (userData.state === 0 || userData.sname === sname)

	useEffect(() => {
		if (showError) {
			prism.highlightAll()
		}
	}, [showError])

	return (
		<>
			<CustomTr acceptState={isAccept(result)}>
				<td>{idResult}</td>
				<UserTd>{sname}</UserTd>
				<td>{name}</td>
				<td>
					{result === 'Compilation Error' && canViewCode(userData, sname) ? (
						<a onClick={handleShow}>{result}</a>
					) : (
						result
					)}
				</td>
				<td>{timeuse} s</td>
				<td>{round(score)}</td>
				<td>
					{canViewCode(userData, sname) && (
						<ButtonGroup>
							<ViewCodeButton {...{ idResult }} />
						</ButtonGroup>
					)}
				</td>
			</CustomTr>

			<Modal show={showError} onHide={handleClose} centered size='lg'>
				<Modal.Header closeButton>
					<Modal.Title>Error : {idResult}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FontPre>
						<code className={`language-cpp`}>{errmsg}</code>
					</FontPre>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default SubmissionTable
