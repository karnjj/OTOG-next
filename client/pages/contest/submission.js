import { useEffect, useState } from 'react'
import { useTokenContext, withAdminAuth } from '../../utils/auth'

import { Container, Row, Col } from 'react-bootstrap'
import Title from '../../components/Title'
import Header from '../../components/Header'
import OrangeButton from '../../components/OrangeButton'
import SubmissionTable from '../../components/SubmissionTable'

import { faTrophy } from '@fortawesome/free-solid-svg-icons'

const Submission = () => {
	const token = useTokenContext()
	const [results, setResults] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest/submission`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = token ? token : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setResults(json.result)
		}
		fetchData()
	}, [])

	return (
		<>
			<Header />
			<Container>
				<Title icon={faTrophy} title='Contest Submission' />
				<Row className='m-auto align-items-baseline'>
					<Col className='mr-auto' />
					<Col as={OrangeButton} href='/contest' sm={4} md={3} lg={2}>
						View Contest
					</Col>
				</Row>
				<hr />
				<SubmissionTable {...{ results }} />
			</Container>
		</>
	)
}

export default withAdminAuth(Submission)
