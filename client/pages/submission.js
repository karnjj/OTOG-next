import { useState } from 'react'
import { useAuthContext, withAuthSync } from '../utils/auth'
import { useGet } from '../utils/api'

import { Row, Col } from 'react-bootstrap'

import { Title, Alink } from '../components/CustomText'
import PageLayout from '../components/PageLayout'
import OrangeButton from '../components/OrangeButton'
import SubmissionTable from '../components/SubmissionTable'
import SubmitGroup from '../components/SubmitGroup'
import OrangeCheck from '../components/OrangeCheck'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

const Submission = () => {
	const { isLogin, isAdmin } = useAuthContext()
	const [showOnlyMe, setShowOnlyMe] = useState(!isAdmin && isLogin)

	const url = `/api/submission?mode=${showOnlyMe ? 'onlyme' : 'full'}`
	const [submissions, isLoading] = useGet(url, [showOnlyMe])
	const { result: results, lastest } = submissions ?? {}

	const handleCheck = (event) => setShowOnlyMe(event.target.checked)

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
					{isLogin && (
						<OrangeCheck
							type='switch'
							id='custom-switch'
							label='แสดงเฉพาะฉัน'
							checked={showOnlyMe}
							onChange={handleCheck}
						/>
					)}
				</Col>
				<Col xs={4} md={3} lg={2}>
					<OrangeButton href='problem' className='w-100'>
						View Problem
					</OrangeButton>
				</Col>
			</Row>
			<hr />
			<SubmissionTable
				isLoading={isLoading}
				canViewCode={showOnlyMe}
				results={results}
			/>
		</PageLayout>
	)
}

export default withAuthSync(Submission)
