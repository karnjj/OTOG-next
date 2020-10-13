import { withAdminAuth, getCookieContext } from '../../utils/auth'

import { Container, Row, Col, Card } from 'react-bootstrap'
import { UserTable, NewUser } from '../../components/AdminUserTable'
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

const UserConfig = () => {
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

export async function getServerSideProps(ctx) {
  const token = getCookieContext(ctx)
  return { props: { token } }
}

export default withAdminAuth(UserConfig)
