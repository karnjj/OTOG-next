import { withAdminAuth, getCookieContext } from '../../utils/auth'

import { Row, Col, Container, Button, Form } from 'react-bootstrap'
import Header from '../../components/admin/Header'

const Config = () => {
  return (
    <>
      <Header />
      <Container>
        <br />
        <br />
        <br />
        <Row>
          <Col lg={3}>
            <h2>GOTO</h2>
            <Button size='lg' variant='info'>
              Save
            </Button>
            <hr />
          </Col>
          <Col lg={6}>
            <Form>
              <Form.Group controlId='exampleForm.SelectCustom'>
                <Form.Label>Grader Mode</Form.Label>
                <Form.Control as='select' custom>
                  <option>Online</option>
                  <option>Close</option>
                </Form.Control>
              </Form.Group>
              <br />
              <Form.Group controlId='exampleForm.SelectCustom'>
                <Form.Label>Contest Mode</Form.Label>
                <Form.Control as='select' custom>
                  <option>No Contest</option>
                  <option>Unrated Contest</option>
                  <option>Rated Contest</option>
                </Form.Control>
              </Form.Group>
              <Button variant='danger'>Restart Grader</Button>
            </Form>
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

export default withAdminAuth(Config)
