import { useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { withAdminAuth } from '../../utils/auth'
import {
	NewContest,
	TaskTable,
	SelectContest,
	ContestConfig,
} from '../../components/admin/ContestTable'
import Header from '../../components/admin/Header'
import { AnnounceEditor } from '../../components/Announce'

import nextCookie from 'next-cookies'
import { httpGet } from '../../utils/api'

const Note = () => (
	<Card>
		<Card.Header as="h6">Note</Card.Header>
		<Card.Body>
			<Card.Text>
				1. <b>Double Click</b> to edit problems in this page.
			</Card.Text>
			<Card.Text>2. Hover over each icons for explanation.</Card.Text>
			<Card.Text>
				3. In add feature you <b>must</b> fill every form carefully.
			</Card.Text>
		</Card.Body>
	</Card>
)

const Contest = ({ contests }) => {
	const [idContest, setIdContest] = useState(0)
	const selectIdContest = (event) => setIdContest(event.target.value)
	return (
		<>
			<Header />
			<Container>
				<br />
				<br />
				<Row>
					<Col lg={3}>
						<NewContest />
						<hr />
						<SelectContest {...{ contests }} setId={selectIdContest} />
						<AnnounceEditor idContest={idContest} />
						<ContestConfig idContest={idContest} />
						<hr />
						<Note />
						<br />
					</Col>
					<Col lg={9}>
						<TaskTable {...{ idContest }} />
					</Col>
				</Row>
			</Container>
		</>
	)
}

Contest.getInitialProps = async (ctx) => {
	const { token } = nextCookie(ctx)
	return await httpGet('/api/admin/contest', token)
}

export default withAdminAuth(Contest)
