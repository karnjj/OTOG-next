import { useState, useEffect } from 'react'
import { useAuthContext } from '../utils/auth'
import { withAuthSync, useTokenContext, isAdmin } from '../utils/auth'

import fetch from 'isomorphic-unfetch'

import { Row, Col, Form, Container, InputGroup } from 'react-bootstrap'
import { CustomTr, CustomTable } from '../components/CustomTable'
import OrangeButton from '../components/OrangeButton'
import Title from '../components/Title'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SubmitGroup from '../components/SubmitGroup'
import ViewCodeButton from '../components/ViewCodeButton'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import vars from '../styles/vars'

import Popup from 'reactjs-popup'

const OrangeCheck = styled(Form.Check)`
	.custom-control-input:checked ~ .custom-control-label::before {
		background: ${vars.orange};
		border: ${vars.orange};
	}
`

const ProbTr = (props) => {
	const {
		id_Prob,
		name,
		time,
		memory,
		sname,
		pass,
		acceptState,
		wrongState,
	} = props
	const userData = useAuthContext()

	return (
		<CustomTr {...{ acceptState, wrongState }}>
			<td>{id_Prob}</td>
			<td>
				<a target='_blank' href={`${process.env.API_URL}/api/docs/${sname}`}>
					{name}
					<br />({time} วินาที {memory} MB)
				</a>
			</td>
			<td>
				{pass ? (
					<Popup trigger={<a>{pass.length}</a>} position='left center'>
						{pass.map((item, i) => (
							<div key={i}>{item}</div>
						))}
					</Popup>
				) : (
					<div>0</div>
				)}
			</td>
			<td>0</td>
			{userData && (
				<td>
					<SubmitGroup {...props}>
						{(acceptState || wrongState) && <ViewCodeButton {...{ id_Prob }} />}
					</SubmitGroup>
				</td>
			)}
		</CustomTr>
	)
}

const ProbTable = (props) => {
	const userData = useAuthContext()
	return (
		<CustomTable ready={props.problems.length}>
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Passed</th>
					<th>Ratings</th>
					{userData && <th>Submit</th>}
				</tr>
			</thead>
			<tbody>
				{props.problems.map((prob, index) => (
					<ProbTr key={index} {...prob} />
				))}
			</tbody>
		</CustomTable>
	)
}

const Problem = () => {
	const token = useTokenContext()
	const userData = useAuthContext()
	const [taskState, setTaskState] = useState([])
	const [searchState, setsearchState] = useState('')
	const [showAll, setShowAll] = useState(false)
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/problem?mode=${
				showAll ? `admin` : `full`
			}`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = token ? token : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setTaskState(json)
		}
		fetchData()
		return function cleanup() {
			setTaskState([])
		}
	}, [showAll])
	const updateSearch = (event) => {
		setsearchState(event.target.value.substr(0, 20))
	}
	const handleCheck = (event) => setShowAll(event.target.checked)

	let filteredTask = taskState.filter((problem) => {
		let id = String(problem.id_Prob)
		return (
			problem.name.indexOf(searchState) !== -1 || id.indexOf(searchState) !== -1
		)
	})
	return (
		<>
			<Header />
			<Container>
				<Title icon={faPuzzlePiece} title='Problem' />
				<Row className='mx-auto justify-content-between align-items-baseline'>
					<Col as={InputGroup} sm={6} md={8} className='px-0'>
						{isAdmin(userData) && (
							<InputGroup.Prepend>
								<InputGroup.Text>
									<OrangeCheck
										type='switch'
										id='custom-switch'
										label='แสดงทั้งหมด'
										onChange={handleCheck}
										disabled={!taskState.length}
									/>
								</InputGroup.Text>
							</InputGroup.Prepend>
						)}
						<Form.Control
							placeholder='ค้นหาโจทย์'
							value={searchState}
							onChange={updateSearch}
							disabled={!taskState.length}
						/>
					</Col>
					<Col as={OrangeButton} sm={4} md={3} lg={2} href='submission'>
						View Submission
					</Col>
				</Row>
				<hr />
				<ProbTable problems={filteredTask} />
				<Footer />
			</Container>
		</>
	)
}

export default withAuthSync(Problem)
