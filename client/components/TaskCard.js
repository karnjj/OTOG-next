import { useState, useEffect } from 'react'
import { useAuthContext } from '../utils/auth'

import {
  Row,
  Col,
  Card,
  Accordion,
  Form,
  ButtonToolbar,
  ButtonGroup,
  Table,
  Badge,
  useAccordionToggle,
} from 'react-bootstrap'
import OrangeButton from './OrangeButton'
import ViewCodeButton from './ViewCodeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { useGet, usePost } from '../utils/api'

const Icon = styled(FontAwesomeIcon)`
  user-select: none;
  cursor: pointer;
`
const MiniSubmission = ({ idContest, idProb, parentCallback }) => {
  const url = `/api/contest/${idContest}/submission?idProb=${idProb}`
  const { data = {}, isValidating, mutate: fetchData } = useGet(url, false)

  const { best_submit, lastest_submit } = data
  const latest = lastest_submit && lastest_submit[0]
  const best = best_submit && best_submit[0]

  if (!!latest) {
    parentCallback(latest.score, best.idResult)
  }

  useEffect(() => {
    const isGrading = !isValidating && latest?.status === 0
    const timeout = isGrading && setTimeout(fetchData, 1000)
    return () => clearTimeout(timeout)
  }, [isValidating])

  const CustomRow = ({ label, result = '-', score = '-', idResult }) => (
    <tr>
      <td>{label}</td>
      <td>{result}</td>
      <td>{score}</td>
      <td>
        {idResult ? <ViewCodeButton mini='true' idResult={idResult} /> : '❌'}
      </td>
    </tr>
  )

  return (
    <Table size='sm' bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Result</th>
          <th>Score</th>
          <th>Code</th>
        </tr>
      </thead>
      <tbody>
        <CustomRow label='Latest' {...latest} />
        <CustomRow label='Best' {...best} />
      </tbody>
    </Table>
  )
}

const TaskCard = (props) => {
  const { idContest, id_Prob, index, name, whopass, sname } = props
  const userData = useAuthContext()
  const [selectedFile, setSelectedFile] = useState(undefined)
  const [fileName, setFileName] = useState('')
  const [fileLang, setFileLang] = useState('C++')
  const [solved, setSolved] = useState(false)
  const [idBest, setIdBest] = useState(-1)
  const [passed, setPassed] = useState(whopass)

  const CustomToggle = (props) => {
    const [isHidden, setIsHidden] = useState(false)
    const handleClick = useAccordionToggle(props.eventKey, () => {
      setIsHidden(!isHidden)
    })
    return (
      <Accordion.Toggle
        {...props}
        as={Icon}
        className='float-right'
        icon={isHidden ? faChevronDown : faChevronUp}
        onClick={handleClick}
      />
    )
  }
  const selectFile = (event) => {
    if (event.target.files[0] !== undefined) {
      setSelectedFile(event.target.files[0])
      setFileName(event.target.files[0].name)
    } else {
      setSelectedFile(undefined)
      setFileName('')
    }
  }
  const post = usePost(`/api/upload/${id_Prob}?contest=${idContest}`)
  const uploadFile = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      return
    }

    const data = new FormData()
    data.append('file', selectedFile)
    data.append('fileLang', fileLang)
    const respone = await post(data, false)
    if (respone.ok) {
      window.location.reload(false)
    }
  }

  return (
    <Accordion
      as={Card}
      defaultActiveKey='0'
      className='mb-4'
      border={solved && 'success'}
    >
      <Accordion.Toggle as={Card.Header} eventKey='0'>
        <h5>
          <Row xs={1}>
            <Col md>
              Task {index} : {name}
            </Col>
            <Col xs='auto' className='ml-auto'>
              {solved && <Badge variant='success'>Solved</Badge>}
            </Col>
          </Row>
          ผ่านแล้ว : {passed}
        </h5>
      </Accordion.Toggle>

      <Accordion.Collapse eventKey='0'>
        <Card.Body as={Row}>
          <Col>
            <MiniSubmission
              idContest={idContest}
              idProb={id_Prob}
              parentCallback={callbackFunc}
            />
          </Col>
          <Col xs={0} lg={1} />
          <Col style={{ maxWidth: '350px' }} className='mx-auto'>
            <Form.File
              as={Col}
              className='mb-4'
              label={fileName || 'Choose file'}
              accept='.c,.cpp'
              onChange={selectFile}
              custom
            />
            <ButtonToolbar as={Row}>
              <ButtonGroup className='ml-auto mr-4'>
                <a
                  className='btn btn-secondary'
                  target='_blank'
                  href={`${process.env.API_URL}/api/docs/${sname}`}
                >
                  View PDF
                </a>
              </ButtonGroup>
              <ButtonGroup className='mr-auto'>
                <OrangeButton type='submit' onClick={uploadFile}>
                  Submit
                </OrangeButton>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Card.Body>
      </Accordion.Collapse>
    </Accordion>
  )
}

export default TaskCard
