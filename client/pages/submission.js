import { useEffect, useState } from 'react'
import { useAuthContext, withAuthSync } from '../utils/auth'

import { Container, Row, Col, Form } from 'react-bootstrap'
import { Alink } from '../components/CustomTable'

import Title from '../components/Title'
import Header from '../components/Header'
import OrangeButton from '../components/OrangeButton'
import SubmissionTable from '../components/SubmissionTable'
import SubmitGroup from '../components/SubmitGroup'
import OrangeCheck from '../components/OrangeCheck'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

const Submission = () => {
	const userData = useAuthContext()
	//const { name, sname } = props.latestProblem
	const [lastest, setLastest] = useState(null)
	const [results, setResults] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/submission`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setLastest(json.lastest)
			setResults(json.result)
		}
		fetchData()
	}, [])

	return (
		<>
			<Header />
			<Container>
				<Title icon={faPuzzlePiece} title='Submission' />
				<Row className='m-auto align-items-center justify-content-between'>
					<Col xs={0} className='mr-auto' />
					{userData && lastest && (
						<Col className='align-items-baseline'>
							<b>ส่งข้อล่าสุด :</b>
							<Alink
								target='_blank'
								className='mx-4'
								href={`${process.env.API_URL}/api/docs/${lastest.sname}`}
							>
								{lastest.name}
							</Alink>
							<SubmitGroup {...lastest} />
						</Col>
					)}
					<Col sm={4} md={3} lg={2}>
						<OrangeCheck
							type='switch'
							id='custom-switch'
							label='แสดงทั้งหมด'
							// onChange={handleCheck}
							// disabled={!taskState.length}
						/>
					</Col>
					<Col as={OrangeButton} href='problem' sm={4} md={3} lg={2}>
						View Problem
					</Col>
				</Row>
				<hr />
				<SubmissionTable {...{ results }} />
			</Container>
		</>
	)
}

export default withAuthSync(Submission)
