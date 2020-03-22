import { useState, useEffect } from 'react'
import { withAuthSync } from '../utils/auth'

import fetch from 'isomorphic-unfetch'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

import { Row, Col, Form, Container } from 'react-bootstrap'
import { useAuthContext } from '../utils/auth'
import OrangeButton from '../components/OrangeButton'
import ProbTable from '../components/ProbTable'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Problem = () => {
	const userData = useAuthContext()
	const [taskState, setTaskState] = useState([])
	const [searchState, setsearchState] = useState('')
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/problem?mode=full`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setTaskState(json)
		}
		fetchData()
	}, [])
	const updateSearch = event => {
		setsearchState(event.target.value.substr(0, 20))
	}
	let filteredTask = taskState.filter(problem => {
		let id = String(problem.id_Prob)
		return (
			problem.name.indexOf(searchState) !== -1 || id.indexOf(searchState) !== -1
		)
	})
	return (
		<>
			<Header />
			<Container>
				<br />
				<br />
				<br />
				<h2>
					{' '}
					<FontAwesomeIcon icon={faPuzzlePiece} /> Problem{' '}
				</h2>
				<br />
				<Row className='m-auto justify-content-between align-items-baseline'>
					<Col
						as={Form.Control}
						sm={6}
						md={8}
						placeholder='ค้นหาโจทย์'
						value={searchState}
						onChange={updateSearch}
					/>
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
