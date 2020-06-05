import { useEffect, useState } from 'react'
import {
	useAuthContext,
	withAuthSync,
	useTokenContext,
	isAdmin,
} from '../utils/auth'

import { Row, Col } from 'react-bootstrap'

import { Title, Alink } from '../components/CustomText'
import PageLayout from '../components/PageLayout'
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
		<PageLayout noFooter>
			<Title icon={faPuzzlePiece} text='Submission' />
			<Row className='align-items-center'>
				<Col
					xs={{ span: 12, order: 'last' }}
					md={{ span: 'auto', order: 'first' }}
					className='d-flex align-items-baseline justify-content-center justify-content-md-start mt-2 mt-md-0'
				>
					{userData && lastest && (
						<div>
							<b>ส่งข้อล่าสุด :</b>
							<Alink
								target='_blank'
								className='mx-4'
								href={`${process.env.API_URL}/api/docs/${lastest.sname}`}
							>
								{lastest.name}
							</Alink>
							<SubmitGroup {...lastest} />
						</div>
					)}
				</Col>
				<Col xs md='auto' className='ml-auto d-flex align-item-center'>
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
				<Col xs md={4} lg={2}>
					<OrangeButton href='problem' className='w-100'>
						View Problem
					</OrangeButton>
				</Col>
			</Row>
			<hr />
			<SubmissionTable canViewCode={showOnlyMe} {...{ results }} />
		</PageLayout>
	)
}

export default withAuthSync(Submission)
