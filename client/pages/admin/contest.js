import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form } from 'react-bootstrap'
import { withAdminAuth, getCookieContext } from '../../utils/auth'
import {
  NewContest,
  TaskTable,
  ContestConfig,
} from '../../components/AdminContestTable'
import Header from '../../components/AdminHeader'
import { AnnounceEditor } from '../../components/Announce'

import { httpGet, useGet } from '../../utils/api'

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

const Contest = ({ tasks }) => {
  const { data = {} } = useGet('/api/admin/contest')
  const { contests = [], selectedTasks = [] } = data

  const [idContest, setIdContest] = useState()
  const latestContest = contests[0]?.idContest ?? 0
  useEffect(() => {
    setIdContest(latestContest)
  }, [latestContest])

  const selectIdContest = (event) => setIdContest(event.target.value)
  const SelectContest = () => (
    <Form.Group>
      <Form.Label>Choose Contest : </Form.Label>
      <Form.Control as='select' onChange={selectIdContest} value={idContest}>
        {contests.map(({ idContest: id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  )

  // const contestData =
  // 	contests.find((contest) => contest.idContest === idContest) ?? {}

  const { data: contestData = {} } = useGet(
    idContest && `/api/admin/contest/${idContest}?mode=config`
  )

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
            <SelectContest />
            <AnnounceEditor idContest={idContest} />
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
      </Container>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const token = getCookieContext(ctx)
  const tasks = await httpGet('/api/admin/problem', { token })
  return { props: { token, tasks } }
}

export default withAdminAuth(Contest)
