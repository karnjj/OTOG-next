import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../utils/auth'
import { useGet } from '../utils/api'

import { Row, Col, Form, InputGroup } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'
import { Title } from '../components/CustomText'
import PageLayout from '../components/PageLayout'
import ProbTable from '../components/ProbTable'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

import styled, { keyframes } from 'styled-components'
import vars from '../styles/vars'
import { useInput } from '../utils'

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
	const { isAdmin } = useAuthContext()

	const [problemSearch, inputProblemSearch] = useInput()
	const [showAll, setShowAll] = useState(isAdmin)
	useEffect(() => setShowAll(isAdmin), [isAdmin])

	const url = `/api/problem?mode=${showAll ? 'admin' : 'full'}`
	const { data: tasks = [], isLoading, isValidating } = useGet(url)

	//switch reload effect
	const [loading, setLoading] = useState(isLoading)
	useEffect(() => {
		if (!isLoading) {
			setLoading(false)
		}
	}, [isValidating])

	const handleChange = (event) => {
		setShowAll(event.target.checked)
		setLoading(true)
	}

	const filteredTasks = tasks?.filter((problem) => {
		const id = String(problem.id_Prob)
		return (
			problem.name.indexOf(problemSearch.substr(0, 20)) !== -1 ||
			id.indexOf(problemSearch.substr(0, 20)) !== -1
		)
	})

	return (
		<PageLayout>
			<Title icon={faPuzzlePiece} text='Problem' />
			<Row>
				<Col as={InputGroup} xs sm={6} md={8}>
					{isAdmin && (
						<InputGroup.Prepend>
							<InputGroup.Text>
								<Form.Check
									type='switch'
									id='custom-switch'
									label='ทั้งหมด '
									checked={showAll}
									onChange={handleChange}
								/>
							</InputGroup.Text>
						</InputGroup.Prepend>
					)}
					<Form.Control placeholder='ค้นหาโจทย์' {...inputProblemSearch} />
				</Col>
				<Col xs sm={4} md={3} lg={2} className='ml-auto'>
					<OrangeButton href='submission' className='w-100'>
						View Submission
					</OrangeButton>
				</Col>
			</Row>
			<hr />
			<ProbTable problems={filteredTasks} isLoading={loading} />
		</PageLayout>
	)
}

export default Problem
