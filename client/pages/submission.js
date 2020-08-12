import { useState, useEffect } from 'react'
import { useAuthContext } from '../utils/auth'
import { useGet } from '../utils/api'

import { Row, Col, Form } from 'react-bootstrap'

import { Title } from '../components/CustomText'
import PageLayout from '../components/PageLayout'
import OrangeButton from '../components/OrangeButton'
import SubmissionTable from '../components/SubmissionTable'
import SubmitGroup from '../components/SubmitGroup'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

const Submission = () => {
	const { isLogin, isAdmin } = useAuthContext()
	const [showOnlyMe, setShowOnlyMe] = useState(!isAdmin && isLogin)
	useEffect(() => setShowOnlyMe(!isAdmin && isLogin), [isAdmin, isLogin])

	const url = `/api/submission?mode=${showOnlyMe ? 'onlyme' : 'full'}`
	const { data: submissions = {}, isLoading, isValidating } = useGet(url)
	const { result: results, lastest } = submissions

	//switch reload effect
	const [loading, setLoading] = useState(isLoading)
	useEffect(() => {
		if (!isLoading) {
			setLoading(false)
		}
	}, [isValidating])

	const handleCheck = (event) => {
		setShowOnlyMe(event.target.checked)
		setLoading(true)
	}

	return (
		<PageLayout>
			<Title icon={faPuzzlePiece} text='Submission' />
			<Row className='align-items-center'>
				<Col
					xs={{ span: 12, order: 'last' }}
					md={{ span: 'auto', order: 'first' }}
					className='d-flex align-items-baseline justify-content-center justify-content-md-start mt-2 mt-md-0'
				>
					{lastest && (showOnlyMe || isAdmin) && (
						<div>
							<b>ส่งข้อล่าสุด :</b>
							<a
								target='_blank'
								className='mx-4'
								href={`${process.env.API_URL}/api/docs/${lastest.sname}`}
							>
								{lastest.name}
							</a>
							<SubmitGroup {...lastest} />
						</div>
					)}
				</Col>
				<Col xs md='auto' className='ml-auto d-flex align-item-center'>
					{isLogin && (
						<Form.Check
							type='switch'
							id='custom-switch'
							label='แสดงเฉพาะฉัน'
							checked={showOnlyMe}
							onChange={handleCheck}
						/>
					)}
				</Col>
				<Col xs={5} md={3} lg={2}>
					<OrangeButton href='problem' className='w-100'>
						View Problem
					</OrangeButton>
				</Col>
			</Row>
			<hr />
			<SubmissionTable
				isLoading={loading}
				canViewCode={showOnlyMe}
				results={results}
			/>
		</PageLayout>
	)
}

export default Submission
