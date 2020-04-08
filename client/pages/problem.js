import { useState, useEffect } from 'react'
import { useAuthContext } from '../utils/auth'
import { withAuthSync, useTokenContext, isAdmin } from '../utils/auth'

import fetch from 'isomorphic-unfetch'

import { Row, Col, Form, Container, InputGroup } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'
import Title from '../components/Title'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProbTable from '../components/ProbTable'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import vars from '../styles/vars'

const OrangeCheck = styled(Form.Check)`
	.custom-control-input:checked ~ .custom-control-label::before {
		background: ${vars.orange};
		border: ${vars.orange};
	}
`

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
