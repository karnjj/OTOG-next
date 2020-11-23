import { useState, useEffect, useCallback } from 'react'

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
import { useGet, usePost } from '../utils/api'
import { useForm } from '../utils'
import Loader from './Loader'

const SubRow = ({ label, result = '-', score = '-', idResult }) => (
  <tr>
    <td>{label}</td>
    <td>{result}</td>
    <td>{score}</td>
    <td>
      {idResult ? <ViewCodeButton mini='true' idResult={idResult} /> : '-'}
    </td>
  </tr>
)

const MiniSubmission = ({ lastest_submit, best_submit }) => {
  const latest = lastest_submit && lastest_submit[0]
  const best = best_submit && best_submit[0]
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
        <SubRow label='Latest' {...latest} />
        <SubRow label='Best' {...best} />
      </tbody>
    </Table>
  )
}

const TaskCard = (props) => {
  const { idContest, id_Prob, index, name, whopass, sname } = props
  const { data, onFileChange, setData } = useForm({ fileLang: 'C++' })
  const { file } = data
  const [loading, setLoading] = useState(false)

  const url = `/api/contest/${idContest}/submission?idProb=${id_Prob}`
  const {
    data: { solved, ...results },
    isLoading,
    isValidating,
    mutate: fetchResult,
  } = useGet(url, { revalidateOnFocus: false })

  useEffect(() => {
    const isGrading = !isValidating && results?.lastest_submit?.[0].status === 0
    const timeout = isGrading && setTimeout(fetchResult, 1000)
    return () => clearTimeout(timeout)
  }, [isValidating])

  const post = usePost(`/api/upload/${id_Prob}?contest=${idContest}`)
  const uploadFile = useCallback(
    async (e) => {
      e.preventDefault()
      if (!file) return
      setData((prevData) => ({ ...prevData, file: undefined }))
      setLoading(true)
      try {
        const body = new FormData()
        Object.keys(data).forEach((item) => body.append(item, data[item]))
        const response = await post(body, false)
        if (response.ok) {
          fetchResult()
        }
      } catch (error) {
        // setAlert({ head: error.name, desc: error.message })
      } finally {
        setLoading(false)
      }
    },
    [data, fetchResult]
  )

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
          ผ่านแล้ว : {whopass}
        </h5>
      </Accordion.Toggle>

      <Accordion.Collapse eventKey='0'>
        <Card.Body as={Row}>
          <Col>
            {isLoading ? (
              <Loader style={{ height: '131px' }} />
            ) : (
              <MiniSubmission {...results} />
            )}
          </Col>
          <Col xs={0} lg={1} />
          <Col style={{ maxWidth: '350px' }} className='mx-auto'>
            <Form.File
              as={Col}
              name='file'
              className='mb-4'
              label={file?.name ?? 'Choose file'}
              accept='.c,.cpp'
              onChange={onFileChange}
              onClick={(event) => {
                event.target.value = null
              }}
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
                <OrangeButton
                  type='submit'
                  onClick={uploadFile}
                  disabled={loading}
                >
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

// const CustomToggle = (props) => {
//   const [isHidden, setIsHidden] = useState(false)
//   const handleClick = useAccordionToggle(props.eventKey, () => {
//     setIsHidden(!isHidden)
//   })
//   return (
//     <Accordion.Toggle
//       {...props}
//       as={Icon}
//       className='float-right'
//       icon={isHidden ? faChevronDown : faChevronUp}
//       onClick={handleClick}
//     />
//   )
// }
