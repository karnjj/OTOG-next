import { useEffect, useState } from 'react'
import { useAuthContext, withAuthSync } from '../utils/auth'

import { Container, Row, Col } from 'react-bootstrap'
import { Alink } from '../components/CustomTable'
import Header from '../components/Header'
import OrangeButton from '../components/OrangeButton'
import SubmissionTable from '../components/SubmissionTable'
import SubmitGroup from '../components/SubmitGroup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
import { formatWithValidation } from 'next/dist/next-server/lib/utils'

const Submission = () => {
	const userData = useAuthContext()
	//const { name, sname } = props.latestProblem
	const { name, sname } = { name: 'pattern_0', sname: 'a4_ratri' }

	return (
		<>
			<Header />
			<Container>
				<br />
				<br />
				<br />
				<h2>
					<FontAwesomeIcon icon={faPuzzlePiece} /> Submission
				</h2>
				<br />
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
				<SubmissionTable />
			</Container>
		</>
	)
}

export default withAuthSync(Submission)
