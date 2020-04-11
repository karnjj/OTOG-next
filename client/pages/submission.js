import { useEffect, useState } from 'react'
import {
	useAuthContext,
	withAuthSync,
	useTokenContext,
	isAdmin,
} from '../utils/auth'

import { Container, Row, Col } from 'react-bootstrap'
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
	const token = useTokenContext()
	//const { name, sname } = props.latestProblem
	const [lastest, setLastest] = useState(null)
	const [results, setResults] = useState()
	const [showOnlyMe, setShowOnlyMe] = useState(!isAdmin(userData) && !!userData)
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/submission?mode=${
				showOnlyMe ? `onlyme` : `full`
			}`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = token ? token : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setLastest(json.lastest)
			setResults(json.result)
		}
		fetchData()
	}, [showOnlyMe])
	const handleCheck = (event) => {
		setResults(undefined)
		setShowOnlyMe(event.target.checked)
	}
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
						{userData && (
							<OrangeCheck
								type='switch'
								id='custom-switch'
								label='แสดงเฉพาะฉัน'
								checked={showOnlyMe}
								onChange={handleCheck}
							/>
						)}
					</Col>
					<Col as={OrangeButton} href='problem' sm={4} md={3} lg={2}>
						View Problem
					</Col>
				</Row>
				<hr />
				<SubmissionTable canViewCode={showOnlyMe} {...{ results }} />
			</Container>
		</>
	)
}

export default withAuthSync(Submission)
