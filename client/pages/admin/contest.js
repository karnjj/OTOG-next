import Error from 'next/error'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useAuthContext, withAdminAuth } from '../../utils/auth'
import { NewContest, TaskTable, SelectContest } from '../../components/admin/ContestTable'
import Header from '../../components/admin/Header'
import { useState, useEffect } from 'react'
import nextCookie from 'next-cookies'

const Note = () => (
	<Card>
		<Card.Header as='h6'>Note</Card.Header>
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

const Contest = props => {
	const { contests } = props
	const [idContest, setIdContest] = useState(0)
	const selectIdContest = event => setIdContest(event.target.value)
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
						<SelectContest {...{contests}} setId={selectIdContest}/>
						<hr />
						<Note />
						<br />
					</Col>
					<Col lg={9}>
						<TaskTable {...{idContest}}/>
					</Col>
				</Row>
			</Container>
		</>
	)
}
Contest.getInitialProps = async ctx => {
    const { token } = nextCookie(ctx)
	const url = `${process.env.API_URL}/api/admin/contest`
	let headers = { 'Content-Type': 'application/json' }
	headers['Authorization'] = token ? token : ''
	const res = await fetch(url, { headers })
	const json = await res.json()
	return { contests : json }
  }
export default withAdminAuth(Contest)
