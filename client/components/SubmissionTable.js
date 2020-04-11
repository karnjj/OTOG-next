import { useState, useEffect } from 'react'
import { useAuthContext, isAdmin } from '../utils/auth'

import { CustomTr, CustomTable, UserTd } from './CustomTable'
import { Modal, ButtonGroup } from 'react-bootstrap'
import ViewCodeButton from './ViewCodeButton'

import styled from 'styled-components'
import prism from 'prismjs'
import vars from '../styles/vars'

const FontPre = styled.pre`
	span,
	code {
		font-family: 'Fira Code', 'Courier New', Courier, monospace;
	}
`
const ResultCode = styled.code`
	color: ${vars.black};
	font-size: 16px;
`

const SubmissionTable = (props) => {
	const userData = useAuthContext()
	const { results, canViewCode } = props
	const showCode = canViewCode || isAdmin(userData)
	return (
		<CustomTable ready={results !== undefined}>
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Problem</th>
					<th>Result</th>
					<th>Time</th>
					<th>Score</th>
					{showCode && <th>Code</th>}
				</tr>
			</thead>
			<tbody>
				{results &&
					results.map((result, index) => (
						<SubTr key={index} {...result} canViewCode={showCode} />
					))}
			</tbody>
		</CustomTable>
	)
}

const SubTr = (props) => {
	const [showError, setShowError] = useState(false)
	const {
		sname,
		name,
		timeuse,
		score,
		result,
		idResult,
		errmsg,
		canViewCode,
	} = props

	const handleShow = () => setShowError(true)
	const handleClose = () => setShowError(false)
	const isAccept = (result) =>
		result
			.split('')
			.filter((res) => res !== '[' && res !== ']')
			.every((res) => res === 'P')
	const round = (num) => Math.round(num * 100) / 100

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
					<ResultCode>
						{result === 'Compilation Error' && canViewCode ? (
							<a onClick={handleShow}>{result}</a>
						) : (
							result
						)}
					</ResultCode>
				</td>
				<td>{timeuse} s</td>
				<td>{round(score)}</td>
				{canViewCode && (
					<td>
						<ButtonGroup>
							<ViewCodeButton {...{ idResult }} />
						</ButtonGroup>
					</td>
				)}
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
