import { withAuthSync, withAdminAuth } from '../../utils/auth'

import { Row, Col, Container, Card } from 'react-bootstrap'
import { TaskTable, NewProblem } from '../../components/admin/TaskTable'
import Header from '../../components/admin/Header'

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

const Task = () => {
	return (
		<>
			<Header />
			<Container>
				<br />
				<br />
				<Row>
					<Col lg={3}>
						<NewProblem />
						<hr />
						<Note />
						<br />
					</Col>
					<Col lg={9}>
						<TaskTable />
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default withAdminAuth(withAuthSync(Task))
