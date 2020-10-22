import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form } from 'react-bootstrap'
import { withAdminAuth } from '../../utils/auth'
import {
  NewContest,
  TaskTable,
  ContestConfig,
} from '../../components/AdminContestTable'
import Header from '../../components/AdminHeader'
import { AnnounceEditor } from '../../components/Announce'

import { useGet, prefetch } from '../../utils/api'

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

const Contests = () => {
  const {
    data: { contests },
  } = useGet('/api/admin/contest')
  const {
    data: { tasks },
  } = useGet('/api/admin/problem')

  const [idContest, setIdContest] = useState(0)
  const latestContest = (contests && contests[0]?.idContest) || 0
  useEffect(() => {
    setIdContest(latestContest)
  }, [latestContest])

  const { data: contestData } = useGet(`/api/admin/contest/${idContest}`)
  const { announce } = contestData
  const selectedTasks = contestData?.problems || []

  const selectIdContest = (event) => setIdContest(event.target.value)
  const SelectContest = () => (
    <Form.Group>
      <Form.Label>Choose Contest : </Form.Label>
      <Form.Control as='select' onChange={selectIdContest} value={idContest}>
        {contests?.map(({ idContest: id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  )

  return (
    <Row>
      <Col lg={3}>
        <NewContest setIdContest={setIdContest} />
        <hr />
        <SelectContest />
        <AnnounceEditor idContest={idContest} announce={announce} />
        <ContestConfig idContest={idContest} contestData={contestData} />
        <hr />
        <Note />
        <br />
      </Col>
      <Col lg={9}>
        <TaskTable
          tasks={tasks}
          idContest={idContest}
          selectedTasks={selectedTasks}
        />
      </Col>
    </Row>
  )
}

const ContestConfigPage = () => (
  <>
    <Header />
    <Container>
      <br />
      <br />
      <Contests />
    </Container>
  </>
)

export async function getServerSideProps(context) {
  const { token } = await prefetch(context, '/api/admin/problem')
  return { props: { token } }
}

export default withAdminAuth(ContestConfigPage)
