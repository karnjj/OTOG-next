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
import OrangeCheck from '../components/OrangeCheck'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

import styled, { keyframes } from 'styled-components'
import vars from '../styles/vars'

const popin = keyframes`
	0% {
		opacity: 0;
		transform: translateX(50%) scale(0) rotateZ(-60deg);
	}
	100% {
		opacity: 1;
		transform: translateX(0) scale(1) rotateZ(0deg);
	}
`
const ProbButton = styled.button`
	width: 38px;
	height: 38px;
	border-radius: 4px;
	margin: 0 5px;
	border: 2px ${(props) => props.color} solid;
	background: ${vars.grey};
	transition: all 0.15s ease;
	animation: ${popin} 0.4s cubic-bezier(0.25, 0.25, 0.25, 1.25) backwards;
	&:active {
		transform: scale(0.75);
	}
	&:focus {
		outline: none;
	}
`

const Problem = () => {
	const token = useTokenContext()
	const userData = useAuthContext()
	const [taskState, setTaskState] = useState()
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
			setTaskState()
		}
	}, [showAll])
	const updateSearch = (event) => {
		setsearchState(event.target.value.substr(0, 20))
	}
	const handleChange = (event) => setShowAll(event.target.checked)

	let filteredTask =
		taskState &&
		taskState.filter((problem) => {
			let id = String(problem.id_Prob)
			return (
				problem.name.indexOf(searchState) !== -1 ||
				id.indexOf(searchState) !== -1
			)
		})
	return (
		<>
			<Header />
			<Container>
				<Title icon={faPuzzlePiece} title='Problem' />
				<Row className='mx-auto justify-content-between align-items-center'>
					<Col as={InputGroup} sm={4} md={3} className='px-0'>
						{isAdmin(userData) && (
							<InputGroup.Prepend>
								<InputGroup.Text>
									<OrangeCheck
										type='switch'
										id='custom-switch'
										label=' '
										onChange={handleChange}
									/>
								</InputGroup.Text>
							</InputGroup.Prepend>
						)}
						<Form.Control
							placeholder='ค้นหาโจทย์'
							value={searchState}
							onChange={updateSearch}
						/>
					</Col>
					<Col lg={1} />
					<Col as={Row} className='justify-content-center' sm={8} md={5} lg={4}>
						<ProbButton color={vars.btn_black} />
						<ProbButton color={vars.btn_green} />
						<ProbButton color={vars.btn_red} />
						<ProbButton color={vars.btn_orng} />
						<ProbButton color={vars.btn_blue} />
					</Col>
					<Col lg={2} />
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
