import { useState, useEffect, useCallback, useMemo } from 'react'
import { usePatch, usePost } from '../utils/api'
import { useForm, useInput, useShow } from '../utils'
import { mutate } from 'swr'

import DatePicker from 'react-datepicker'
import { Button, Modal, Form, Col, InputGroup } from 'react-bootstrap'
import { CustomTable } from './CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCog,
  faEye,
  faEyeSlash,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { RenderOnIntersect } from './RenderOnIntersect'
import styled from 'styled-components'

const StyledInputGroup = styled(InputGroup)`
  .react-datepicker-wrapper {
    width: 50%;
  }
`

export const NewContest = ({ setIdContest }) => {
  const [show, handleShow, handleClose] = useShow(false)
  const { data, onValueChange, setData } = useForm({
    name: '',
    mode: 'unrated',
    judge: 'classic',
    startDate: new Date(),
    endDate: new Date(),
  })
  const { startDate, endDate } = data

  const post = usePost('/api/admin/contest')
  const onSubmit = async (event) => {
    event.preventDefault()
    const { startDate, endDate, ...rest } = data
    const start = Math.floor(Date.parse(startDate) / 1000)
    const end = Math.floor(Date.parse(endDate) / 1000)
    const body = JSON.stringify({ ...rest, start, end })
    const res = await post(body)
    if (res.ok) {
      handleClose()
      const { contests } = await mutate('/api/admin/contest')
      setIdContest(contests[0].idContest)
    }
  }
  return (
    <>
      <Button variant='success' size='lg' onClick={handleShow}>
        <FontAwesomeIcon icon={faPlusCircle} /> New Contest
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Contest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Contest Name : </Form.Label>
              <Form.Control name='name' onChange={onValueChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Choose Mode : </Form.Label>
              <InputGroup>
                <Form.Control
                  name='mode'
                  onChange={onValueChange}
                  as='select'
                  defaultValue='unrated'
                >
                  <option value='unrated'>Unrated Contest</option>
                  <option value='rated'>Rated Contest</option>
                </Form.Control>
                <Form.Control
                  name='judge'
                  onChange={onValueChange}
                  as='select'
                  defaultValue='classic'
                >
                  <option value='classic'>Classic (Time based)</option>
                  <option value='acm'>ACM Mode</option>
                  <option disabled>OTOG Mode</option>
                  <option disabled>Blind Mode</option>
                </Form.Control>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Time : </Form.Label>
              <StyledInputGroup>
                <Form.Control
                  as={DatePicker}
                  selected={startDate}
                  onChange={(date) =>
                    setData((data) => ({
                      ...data,
                      startDate: date,
                      endDate: date,
                    }))
                  }
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={30}
                  timeCaption='time'
                  dateFormat='d/MMMM/yyyy HH:mm'
                />
                <Form.Control
                  as={DatePicker}
                  selected={endDate}
                  onChange={(date) =>
                    setData((data) => ({ ...data, endDate: date }))
                  }
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={30}
                  timeCaption='time'
                  dateFormat='d/MMMM/yyyy HH:mm'
                />
              </StyledInputGroup>
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

export const ContestConfig = ({ contestData, idContest }) => {
  const isSelected = idContest !== 0
  const [show, handleShow, handleClose] = useShow(false)
  const { data, onValueChange, setData: setContestData } = useForm(contestData)
  const { name, mode, judge, startDate, endDate } = data
  useEffect(() => {
    const { startDate, endDate } = contestData
    setContestData({
      ...contestData,
      startDate: new Date(startDate * 1000),
      endDate: new Date(endDate * 1000),
    })
  }, [contestData])

  const patch = usePatch(`/api/admin/contest/${idContest}`)
  const onSubmit = async (event) => {
    event.preventDefault()
    data.startDate = Math.floor(Date.parse(startDate) / 1000)
    data.endDate = Math.floor(Date.parse(endDate) / 1000)
    const res = await patch(JSON.stringify(data))
    if (res.ok) {
      handleClose()
      mutate('/api/admin/contest')
    }
  }

  return (
    <>
      <Button variant='warning' onClick={handleShow} disabled={!isSelected}>
        <FontAwesomeIcon icon={faCog} />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contest #{idContest}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Contest Name : </Form.Label>
              <Form.Control name='name' value={name} onChange={onValueChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Choose Mode : </Form.Label>
              <InputGroup>
                <Form.Control
                  as='select'
                  name='mode'
                  defaultValue={mode}
                  onChange={onValueChange}
                >
                  <option value='unrated'>Unrated Contest</option>
                  <option value='rated'>Rated Contest</option>
                </Form.Control>
                <Form.Control
                  as='select'
                  name='judge'
                  defaultValue={judge}
                  onChange={onValueChange}
                >
                  <option value='classic'>Classic (Time based)</option>
                  <option value='acm'>ACM Mode</option>
                  <option disabled>OTOG Mode</option>
                  <option disabled>Blind Mode</option>
                </Form.Control>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Time : </Form.Label>
              <StyledInputGroup>
                <Form.Control
                  as={DatePicker}
                  selected={startDate}
                  onChange={(date) =>
                    setContestData((prevData) => ({
                      ...prevData,
                      startDate: date,
                      endDate: date,
                    }))
                  }
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={30}
                  timeCaption='time'
                  dateFormat='d/MMMM/yyyy HH:mm'
                />
                <Form.Control
                  as={DatePicker}
                  selected={endDate}
                  onChange={(date) =>
                    setContestData((prevData) => ({
                      ...prevData,
                      endDate: date,
                    }))
                  }
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={30}
                  timeCaption='time'
                  dateFormat='d/MMMM/yyyy HH:mm'
                />
              </StyledInputGroup>
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

const ConfigTask = ({ task: { id_Prob }, see, idContest }) => {
  const [state, setState] = useState()
  useEffect(() => {
    setState(see)
  }, [see])

  const patch = usePatch(`/api/admin/contest/${idContest}/${id_Prob}`)
  const handleChangeState = async (event) => {
    event.preventDefault()
    setState(!state)
    const body = JSON.stringify({ onoff: state })
    await patch(body)
  }

  return (
    <Button
      title={state ? 'Close' : 'Open'}
      variant={state ? 'light' : 'dark'}
      onClick={handleChangeState}
    >
      <FontAwesomeIcon icon={state ? faEye : faEyeSlash} />
    </Button>
  )
}

const EditModal = (props) => {
  const { show, handleClose, task } = props
  const { id_Prob } = task

  const { data, onValueChange, onFileChange, setData } = useForm(task)
  const { name, sname, memory, time, score, pdf, subtask, zip } = data
  useEffect(() => {
    setData(task)
  }, [task])

  const [saveState, saving, saved] = useShow(false)
  const post = usePost(`/api/admin/problem/${id_Prob}?option=save`)
  const onSave = async (event) => {
    event.preventDefault()
    saving()
    const formData = new FormData()
    Object.keys(data).forEach((item) => formData.append(item, data[item]))
    const response = await post(formData, false)
    if (response.ok) {
      handleClose()
      mutate('/api/admin/problem')
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

const TaskRow = (props) => {
  const { task, selectTask } = props
  const { id_Prob, name, sname, memory, time, score } = task
  const handleShow = useCallback(() => {
    selectTask(task)
  }, [task])
  return (
    <RenderOnIntersect
      id={`admin/contest/${id_Prob}`}
      initialHeight='63px'
      as='tr'
    >
      <tr onDoubleClick={handleShow}>
        <td>{id_Prob}</td>
        <td>
          <a target='_blank' href={`${process.env.API_URL}/api/docs/${sname}`}>
            {name}
          </a>
        </td>
        <td>{time}</td>
        <td>{memory}</td>
        <td>{score}</td>
        <td>
          <ConfigTask {...props} />
        </td>
      </tr>
    </RenderOnIntersect>
  )
}

export const TaskTable = ({ tasks, idContest, selectedTasks, isLoading }) => {
  const [taskModal, setTaskModal] = useState({ show: false, task: {} })
  const selectTask = useCallback((task) => {
    setTaskModal({ task, show: true })
  }, [])
  const handleClose = useCallback(() => {
    setTaskModal((prevState) => ({ ...prevState, show: false }))
  }, [])

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
          <RenderOnIntersect
            id='admin/contest/head'
            initialHeight='50px'
            as='tr'
          >
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Time</th>
              <th>Memory</th>
              <th>Score</th>
              <th>Config</th>
            </tr>
          </RenderOnIntersect>
        </thead>
        <tbody>
          {filteredTasks?.map((task) => (
            <TaskRow
              key={task.id_Prob}
              task={task}
              selectTask={selectTask}
              idContest={idContest}
              see={selectedTasks.includes(task.id_Prob)}
            />
          ))}
        </tbody>
      </CustomTable>
      <EditModal {...taskModal} handleClose={handleClose} />
    </>
  )
}
