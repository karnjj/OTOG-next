import { useState, useEffect } from 'react'
import {
	useAuthContext,
	withAuthSync,
	useTokenContext,
	isAdmin,
} from '../utils/auth'
import { useGet } from '../utils/api'

import { Row, Col, Form, InputGroup } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'
import { Title } from '../components/CustomText'
import PageLayout from '../components/PageLayout'
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

	const [searchState, setsearchState] = useState('')
	const [showAll, setShowAll] = useState(isAdmin(userData))

	const url = `/api/problem?mode=${showAll ? 'admin' : 'full'}`
	const [taskState] = useGet(url, token, [showAll])

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
		<PageLayout>
			<Title icon={faPuzzlePiece} text='Problem' />
			<Row>
				<Col as={InputGroup} xs sm={6} md={8}>
					{isAdmin(userData) && (
						<InputGroup.Prepend>
							<InputGroup.Text>
								<OrangeCheck
									type='switch'
									id='custom-switch'
									label='ทั้งหมด '
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
				<Col xs sm={4} md={3} lg={2} className='ml-auto'>
					<OrangeButton href='submission' className='w-100'>
						View Submission
					</OrangeButton>
				</Col>
			</Row>
			<hr />
			<ProbTable problems={filteredTask} />
		</PageLayout>
	)
}

export default withAuthSync(Problem)
