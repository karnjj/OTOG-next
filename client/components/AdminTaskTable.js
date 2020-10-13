import { useState, useEffect, memo } from 'react'
import { useAuthContext } from '../utils/auth'
import { useGet, usePost, useHttp } from '../utils/api'
import { CustomTable } from './CustomTable'
import {
  ButtonGroup,
  Button,
  Modal,
  Form,
  Col,
  Row,
  InputGroup,
  Badge,
} from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencilAlt,
  faSyncAlt,
  faEye,
  faEyeSlash,
  faTrash,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { useShow } from '../utils'
import { mutate } from 'swr'

export const NewTask = () => {
  const [show, handleShow, handleClose] = useShow(false)
  const [data, setData] = useState({})
  const { name, sname, numCase, memory, time, score, pdf, zip } = data

  const selectFile = (event) =>
    setData({ ...data, [event.target.id]: event.target.files[0] })
  const handleChangeName = (event) =>
    setData({ ...data, name: event.target.value })
  const handleChangeSname = (event) =>
    setData({ ...data, sname: event.target.value })
  const handleChangeMemory = (event) =>
    setData({ ...data, memory: Number(event.target.value) ?? '' })
  const handleChangeTime = (event) =>
    setData({ ...data, time: Number(event.target.value) ?? '' })
  const handleChangeNumCase = (event) =>
    setData({ ...data, numCase: Number(event.target.value) ?? '' })
  const handleChangeScore = (event) =>
    setData({ ...data, score: Number(event.target.value) ?? '' })

  const post = usePost('/api/admin/problem')
  const onSubmit = async (event) => {
    event.preventDefault()
    const body = new FormData()
    Object.keys(data).forEach((item) => body.append(item, data[item]))
    const response = await post(body, false)
    if (response.ok) {
      handleClose()
      mutate('/api/admin/problem')
    }
  }

  return (
    <>
      <Button variant='success' size='lg' onClick={handleShow}>
        <FontAwesomeIcon icon={faPlusCircle} /> New Task
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Description : </Form.Label>
              <InputGroup>
                <Form.Control
                  value={name}
                  onChange={handleChangeName}
                  placeholder='Display Name'
                  required
                />
                <Form.Control
                  value={sname}
                  onChange={handleChangeSname}
                  placeholder='Short Name'
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <Form.File
                id='pdf'
                label={pdf?.name ?? 'Document (PDF)'}
                accept='.pdf'
                onChange={selectFile}
                custom
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='zip'
                label={zip?.name ?? 'Testcases (ZIP)'}
                accept='.zip'
                onChange={selectFile}
                custom
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Constraint : </Form.Label>
              <InputGroup>
                <Form.Control
                  value={time}
                  onChange={handleChangeTime}
                  placeholder='Time Limit (s)'
                  required
                />
                <Form.Control
                  value={memory}
                  onChange={handleChangeMemory}
                  placeholder='Memory (MB)'
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <InputGroup>
                <Form.Control
                  value={numCase}
                  onChange={handleChangeNumCase}
                  placeholder='Testcases e.g.10'
                />
                <Form.Control
                  value={score}
                  onChange={handleChangeScore}
                  placeholder='Score'
                  required
                />
              </InputGroup>
            </Form.Group>
            <hr />
            <Button variant='success' type='submit' block>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

const ConfigTask = ({ index, id_Prob, handleShow, state, sname }) => {
  const post = usePost(`/api/admin/problem/${id_Prob}?option=onoff`)
  const del = useHttp('DELETE', `/api/admin/problem/${id_Prob}?sname=${sname}`)

  const handleChangeState = async (event) => {
    event.preventDefault()
    mutate(
      '/api/admin/problem',
      async (tasks) => [
        ...tasks.slice(0, index),
        { ...tasks[index], state: !state },
        ...tasks.slice(index + 1),
      ],
      false
    )
    const body = JSON.stringify({ onoff: state })
    const response = await post(body)
    if (response.ok) {
      mutate('/api/admin/problem')
    }
  }

  const handleDelete = async () => {
    if (confirm(`Delete task id : ${id_Prob}`)) {
      const res = await del()
      if (res.ok) {
        mutate('/api/admin/problem')
      }
    }
  }

  return (
    <ButtonGroup>
      <Button title='Edit' variant='info' onClick={handleShow}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </Button>
      <Button title='Rejudge' variant='warning'>
        <FontAwesomeIcon icon={faSyncAlt} />
      </Button>
      <Button
        title={state ? 'Close' : 'Open'}
        variant={state ? 'light' : 'dark'}
        onClick={handleChangeState}
      >
        <FontAwesomeIcon icon={state ? faEye : faEyeSlash} />
      </Button>
      <Button title='Delete' variant='danger' onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </ButtonGroup>
  )
}

const EditModal = (props) => {
  const { show, handleClose, id_Prob, ...rest } = props
  const [data, setData] = useState(rest)
  const { name, sname, memory, time, score, rating, subtask, pdf, zip } = data
  const [saveState, saving, saved] = useShow(false)

  const selectFile = (event) =>
    setData({ ...data, [event.target.id]: event.target.files[0] })
  const handleChangeName = (event) =>
    setData({ ...data, name: event.target.value })
  const handleChangeSname = (event) =>
    setData({ ...data, sname: event.target.value })
  const handleChangeMemory = (event) =>
    setData({ ...data, memory: Number(event.target.value) ?? '' })
  const handleChangeTime = (event) =>
    setData({ ...data, time: Number(event.target.value) ?? '' })
  const handleChangeScore = (event) =>
    setData({ ...data, score: Number(event.target.value) ?? '' })
  const handleChangeRating = (event) =>
    setData({ ...data, rating: event.target.value })
  const handleChangeSubtask = (event) =>
    setData({ ...data, subtask: event.target.value })

  const post = usePost(`/api/admin/problem/${id_Prob}?option=save`)
  const onSave = async (event) => {
    event.preventDefault()
    saving()
    const body = new FormData()
    Object.keys(data).forEach((item) => body.append(item, data[item]))
    const response = await post(body, false)
    if (response.ok) {
      mutate('/api/admin/problem')
      handleClose()
      saved()
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Task #{id_Prob}</Modal.Title>
      </Modal.Header>
      <Form as={Modal.Body}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control defaultValue={name} onChange={handleChangeName} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Short Name</Form.Label>
          <Form.Control defaultValue={sname} onChange={handleChangeSname} />
        </Form.Group>
        <Form.Group as={Row}>
          <Col xs={6}>
            <Form.Label>Time Limit (s)</Form.Label>
            <Form.Control defaultValue={time} onChange={handleChangeTime} />
          </Col>
          <Col xs={6}>
            <Form.Label>Memory (MB)</Form.Label>
            <Form.Control defaultValue={memory} onChange={handleChangeMemory} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col xs={6}>
            <Form.Label>Testcases</Form.Label>
            <Form.Control
              defaultValue={subtask}
              onChange={handleChangeSubtask}
            />
          </Col>
          <Col xs={6}>
            <Form.Label>Score</Form.Label>
            <Form.Control defaultValue={score} onChange={handleChangeScore} />
          </Col>
        </Form.Group>
        <Form.Group>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Rating</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder='eg.1500'
              defaultValue={rating}
              onChange={handleChangeRating}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.File
            id='pdf'
            label={pdf?.name ?? 'New Document (PDF)'}
            accept='.pdf'
            onChange={selectFile}
            custom
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.File
            id='zip'
            label={zip?.name ?? 'New Testcases (ZIP)'}
            accept='.zip'
            onChange={selectFile}
            custom
          />
        </Form.Group>
      </Form>
      <Modal.Footer>
        <Button variant='success' onClick={onSave} disabled={saveState}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const TaskRow = memo((props) => {
  const { id_Prob, name, sname, memory, time, rating, noTestcase } = props
  const [show, handleShow, handleClose] = useShow(false)

  return (
    <tr onDoubleClick={handleShow}>
      <td>{id_Prob}</td>
      <td>
        <a target='_blank' href={`${process.env.API_URL}/api/docs/${sname}`}>
          {name}
        </a>{' '}
        {noTestcase && <Badge variant='warning'>No Testcases</Badge>}
      </td>
      <td>{time}</td>
      <td>{memory}</td>
      <td>{rating ?? '-'}</td>
      <td>
        <ConfigTask {...props} {...{ handleShow }} />
        <EditModal {...props} {...{ handleClose, show }} />
      </td>
    </tr>
  )
})

export const TaskTable = () => {
  const { data: tasks } = useGet('/api/admin/problem')

  return (
    <CustomTable ready={!!tasks} align='left'>
      <thead className='thead-light'>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Time</th>
          <th>Memory</th>
          <th>Rating</th>
          <th>Config</th>
        </tr>
      </thead>
      <tbody>
        {tasks?.map((task, index) => (
          <TaskRow key={index} index={index} {...task} />
        ))}
      </tbody>
    </CustomTable>
  )
}
