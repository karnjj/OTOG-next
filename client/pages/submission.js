import { useEffect, useState } from 'react'
import { useAuthContext, withAuthSync } from '../utils/auth'

import { Container, Row, Col } from 'react-bootstrap'
import { Alink } from '../components/CustomTable'

import Title from '../components/Title'
import Header from '../components/Header'
import OrangeButton from '../components/OrangeButton'
import SubmissionTable from '../components/SubmissionTable'
import SubmitGroup from '../components/SubmitGroup'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
import { formatWithValidation } from 'next/dist/next-server/lib/utils'

const Submission = () => {
	const userData = useAuthContext()
	//const { name, sname } = props.latestProblem
	const { name, sname } = { name: 'pattern_0', sname: 'a4_ratri' }

	const [results, setResults] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/submission`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setResults(json)
		}
		fetchData()
	}, [])

	return (
		<>
			<Header />
			<Container>
				<Title icon={faPuzzlePiece} title='Submission' />
				<Row className='m-auto align-items-baseline'>
					<Col className='mr-auto'>
						{userData && (
							<div className='d-flex align-items-baseline'>
								<b>ส่งข้อล่าสุด :</b>
								<Alink
									target='_blank'
									className='mx-4'
									href={`${process.env.API_URL}/api/docs/${sname}`}
								>
									{name}
								</Alink>
								<SubmitGroup {...{ name, sname }} />
							</div>
						)}
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
