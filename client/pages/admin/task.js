import { withAuthSync } from '../../utils/auth'

import { Row, Col, Container, Card } from 'react-bootstrap'
import { TaskTable, NewProblem } from '../../components/admin/TaskTable'
import Header from '../../components/admin/Header'

const Guide = () => (
	<Card>
		<Card.Header as='h6'>
			Note
		</Card.Header>
		<Card.Body>
			<Card.Text>
				1. You can add and edit problems in this page.
			</Card.Text>
			<Card.Text>
				2. Hover over each icons for explanation.
			</Card.Text>
			<Card.Text>
				3. In add feature you <b>must</b> fill every form carefully.
			</Card.Text>
		</Card.Body>
	</Card>
)

const Task = (props) => {
	const userData = props.jsData
	return (
		<>
			<Header/>
			<Container>
				<br/><br/>
				<Row>
					<Col lg={3}>
						<NewProblem/>
						<hr/>
						<Guide/>
						<br/>
					</Col>
					<Col lg={9}>
						<TaskTable {...{userData}}/>
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default withAuthSync(Task)