import { withAuthSync } from '../../utils/auth'

import { Row, Col, Container, Card } from 'react-bootstrap'
import { TaskTable, NewProblem } from '../../components/admin/TaskTable'
import Header from '../../components/admin/Header'

const Guide = () => (
	<Card>
		<Card.Header>
			Note
		</Card.Header>
		<Card.Body>
			1. You can add and edit problems in this page.<br/><br/>
			2. Hover over each icons for explanation.<br/><br/>
			3. In add feature you must fill every form carefully.<br/>
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