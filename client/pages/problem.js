import { useState, useEffect } from 'react'
import { withAuthSync, useTokenContext, isAdmin } from '../utils/auth'

import fetch from 'isomorphic-unfetch'

import { Row, Col, Form, Container } from 'react-bootstrap'
import { useAuthContext } from '../utils/auth'
import OrangeButton from '../components/OrangeButton'
import ProbTable from '../components/ProbTable'
import Title from '../components/Title'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

import { BallBeat } from 'react-pure-loaders';

const Problem = () => {
	const token = useTokenContext()
	const userData = useAuthContext()
	const [taskState, setTaskState] = useState([])
	const [searchState, setsearchState] = useState('')
	const [showAll, setShowAll] = useState(false)
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/problem?mode=${(showAll) ? `admin` : `full`}`
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
	const updateSearch = event => {
		setsearchState(event.target.value.substr(0, 20))
	}
	const handleCheck = event => setShowAll(event.target.checked)

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
				<Title icon={faPuzzlePiece} title='Problem' />
				<Row className='m-auto justify-content-between align-items-baseline'>
					<Col
						as={Form.Control}
						sm={6}
						md={8}
						placeholder='ค้นหาโจทย์'
						value={searchState}
						onChange={updateSearch}
					/>
					{isAdmin(userData) && (<Form>
						<Form.Check
							type="switch"
							id="custom-switch"
							label="All Problems"
							onChange={handleCheck}
						/>
					</Form>)}
					<Col as={OrangeButton} sm={4} md={3} lg={2} href='submission'>
						View Submission
					</Col>
				</Row>
				<hr />
				{!(taskState.length == 0) ?
					<ProbTable problems={filteredTask} /> :
					<div align="center">
						<BallBeat
							color={'#ff851b'}
							loading={true}
						/>
					</div>
				}
				<Footer />
			</Container>
		</>
	)
}

export default withAuthSync(Problem)
