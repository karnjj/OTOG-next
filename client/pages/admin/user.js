import { withAdminAuth } from '../../utils/auth'

import { Container, Row, Col, Card } from 'react-bootstrap'
import { UserTable, NewUser } from '../../components/admin/UserTable'
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

const UserConfig = props => {
	return (
		<>
			<Header />
			<Container>
				<br />
				<br />
				<Row>
					<Col lg={3}>
						<NewUser />
						<hr />
						<Note />
						<br />
					</Col>
					<Col lg={9}>
						<UserTable />
					</Col>
				</Row>
			</Container>
		</>
	)
}
export default withAdminAuth(UserConfig)
