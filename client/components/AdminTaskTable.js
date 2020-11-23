import { useMemo, memo } from 'react'
import { useGet, usePost, useDelete } from '../utils/api'
import { CustomTable } from './CustomTable'
import {
  ButtonGroup,
  Button,
  Modal,
  Form,
  Col,
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
import { RenderOnIntersect } from './RenderOnIntersect'
import { useForm, useInput, useShow } from '../utils'
import { mutate } from 'swr'

export const NewTask = () => {
  const [show, handleShow, handleClose] = useShow(false)
  const { data, onFileChange, onValueChange } = useForm({})
  const { name, sname, numCase, memory, time, score, pdf, zip } = data
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
              <Form.Label>Display Name / Short Name : </Form.Label>
              <Form.Row>
                <InputGroup as={Col}>
                  <Form.Control
                    name='name'
                    value={name}
                    onChange={onValueChange}
                    placeholder='Display Name'
                    required
                  />
                </InputGroup>
                <InputGroup as={Col}>
                  <Form.Control
                    name='sname'
                    value={sname}
                    onChange={onValueChange}
                    placeholder='Short Name'
                    required
                  />
                </InputGroup>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>Constraints : </Form.Label>
              <Form.Row>
                <InputGroup as={Col}>
                  <Form.Control
                    name='time'
                    value={time}
                    onChange={onValueChange}
                    placeholder='Time Limit'
                    required
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>s</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                <InputGroup as={Col}>
                  <Form.Control
                    name='memory'
                    value={memory}
                    onChange={onValueChange}
                    placeholder='Memory'
                    required
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>MB</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Row>
                <InputGroup as={Col}>
                  <Form.Control
                    name='score'
                    value={score}
                    onChange={onValueChange}
                    placeholder='Score'
                    required
                  />
                </InputGroup>
                <InputGroup as={Col}>
                  <Form.Control
                    name='numCase'
                    value={numCase}
                    onChange={onValueChange}
                    placeholder='Test Cases'
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>case(s)</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>Files :</Form.Label>
              <Form.File
                custom
                required
                name='pdf'
                accept='.pdf'
                onChange={onFileChange}
                label={pdf?.name ?? 'Document (PDF)'}
                onClick={(event) => {
                  event.target.value = null
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                custom
                name='zip'
                accept='.zip'
                onChange={onFileChange}
                label={zip?.name ?? 'Testcases (ZIP)'}
                onClick={(event) => {
                  event.target.value = null
                }}
              />
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
  const del = useDelete(`/api/admin/problem/${id_Prob}?sname=${sname}`)

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
  const { data, onValueChange, onFileChange } = useForm(rest)
  const { name, sname, memory, time, score, rating, subtask, pdf, zip } = data

  const [saveState, saving, saved] = useShow(false)
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
      <Modal.Body>
        <Form onSubmit={onSave}>
          <Form.Group>
            <Form.Label>Display Name / Short Name : </Form.Label>
            <Form.Row>
              <InputGroup as={Col}>
                <Form.Control
                  name='name'
                  value={name ?? ''}
                  onChange={onValueChange}
                  placeholder='Display Name'
                  required
                />
              </InputGroup>
              <InputGroup as={Col}>
                <Form.Control
                  name='sname'
                  value={sname ?? ''}
                  onChange={onValueChange}
                  placeholder='Short Name'
                  required
                />
              </InputGroup>
            </Form.Row>
          </Form.Group>

          <Form.Group>
            <Form.Label>Constraints : </Form.Label>
            <Form.Row>
              <InputGroup as={Col}>
                <Form.Control
                  name='time'
                  value={time ?? ''}
                  onChange={onValueChange}
                  placeholder='Time Limit'
                  required
                />
                <InputGroup.Append>
                  <InputGroup.Text>s</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <InputGroup as={Col}>
                <Form.Control
                  name='memory'
                  value={memory ?? ''}
                  onChange={onValueChange}
                  placeholder='Memory'
                  required
                />
                <InputGroup.Append>
                  <InputGroup.Text>MB</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Row>
          </Form.Group>

          <Form.Group>
            <Form.Row>
              <InputGroup as={Col}>
                <InputGroup.Prepend>
                  <InputGroup.Text>Score</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  name='score'
                  value={score ?? ''}
                  onChange={onValueChange}
                  placeholder='Score'
                  required
                />
              </InputGroup>
              <InputGroup as={Col}>
                <InputGroup.Prepend>
                  <InputGroup.Text>Rating</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  name='rating'
                  value={rating ?? ''}
                  placeholder='eg.1500'
                  onChange={onValueChange}
                />
              </InputGroup>
            </Form.Row>
          </Form.Group>

          <Form.Group>
            <Form.Row>
              <InputGroup as={Col}>
                <InputGroup.Prepend>
                  <InputGroup.Text>Subtasks</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  name='subtask'
                  value={subtask ?? ''}
                  onChange={onValueChange}
                  placeholder='Subtasks'
                />
              </InputGroup>
            </Form.Row>
          </Form.Group>

          <Form.Group>
            <Form.Label>Files :</Form.Label>
            <Form.File
              custom
              name='pdf'
              accept='.pdf'
              onChange={onFileChange}
              label={pdf?.name ?? 'Document (PDF)'}
              onClick={(event) => {
                event.target.value = null
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.File
              custom
              name='zip'
              accept='.zip'
              onChange={onFileChange}
              label={zip?.name ?? 'Testcases (ZIP)'}
              onClick={(event) => {
                event.target.value = null
              }}
            />
          </Form.Group>

          <hr />
          <Button disabled={saveState} variant='success' type='submit' block>
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

const TaskRow = memo((props) => {
  const { id_Prob, name, sname, memory, time, rating, noTestcase } = props
  const [show, handleShow, handleClose] = useShow(false)

  return (
    <RenderOnIntersect
      id={`admin/tasks/${id_Prob}`}
      initialHeight='63px'
      as='tr'
    >
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
          <ConfigTask {...props} handleShow={handleShow} />
          <EditModal {...props} handleClose={handleClose} show={show} />
        </td>
      </tr>
    </RenderOnIntersect>
  )
})

export const TaskTable = () => {
  const {
    data: { tasks },
    isLoading,
  } = useGet('/api/admin/problem')

  const [taskSearch, inputTaskSearch] = useInput()
  const filteredTasks = useMemo(
    () =>
      tasks?.filter(
        (task) =>
          task.name.toLowerCase().indexOf(taskSearch.toLowerCase()) !== -1 ||
          String(task.id_Prob)
            .toLowerCase()
            .indexOf(taskSearch.toLowerCase()) !== -1
      ),
    [tasks, taskSearch]
  )

  return (
    <>
      <Form.Control {...inputTaskSearch} placeholder='ค้นหาโจทย์' />
      <hr />
      <CustomTable isLoading={isLoading} align='left'>
        <thead className='thead-light'>
          <RenderOnIntersect id='admin/tasks/head' initialHeight='50px' as='tr'>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Time</th>
              <th>Memory</th>
              <th>Rating</th>
              <th>Config</th>
            </tr>
          </RenderOnIntersect>
        </thead>
        <tbody>
          {filteredTasks?.map((task) => (
            <TaskRow key={task.id_Prob} {...task} />
          ))}
        </tbody>
      </CustomTable>
    </>
  )
}
