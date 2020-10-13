import { withAdminAuth, getCookieContext } from '../../utils/auth'

import { Row, Col, Container, Card } from 'react-bootstrap'
import { TaskTable, NewTask } from '../../components/AdminTaskTable'
import Header from '../../components/AdminHeader'

const Note = () => (
  <Card>
    <Card.Header as='h6'>Note</Card.Header>
    <Card.Body>
      <Card.Text>
        1. <b>Double Click</b> to edit tasks in this page.
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
            <NewTask />
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

export async function getServerSideProps(ctx) {
  const token = getCookieContext(ctx)
  return { props: { token } }
}

export default withAdminAuth(Task)
