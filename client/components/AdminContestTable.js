import { useState, useEffect, useCallback } from 'react'
import { useInput, useShow } from '../utils'
import { useHttp, usePatch, usePost } from '../utils/api'
import { mutate } from 'swr'

import DatePicker from 'react-datepicker'
import { Button, Modal, Form, Col, Row, InputGroup } from 'react-bootstrap'
import { CustomTable } from './CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCog,
  faEye,
  faEyeSlash,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { RenderOnIntersect } from './RenderOnIntersect'

export const NewContest = ({ setIdContest }) => {
  const [show, handleShow, handleClose] = useShow(false)
  const [name, inputName] = useInput()
  const [mode, inputMode] = useInput('unrated')
  const [judge, inputJudge] = useInput('classic')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const post = usePost('/api/admin/contest')
  const onSubmit = async (event) => {
    event.preventDefault()
    const start = Math.floor(Date.parse(startDate) / 1000)
    const end = Math.floor(Date.parse(endDate) / 1000)
    const data = { name, mode, judge, start, end }
    const body = JSON.stringify(data)
    const res = await post(body)
    if (res.ok) {
      handleClose()
      const contests = await mutate('/api/admin/contest')
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
          <Form>
            <Form.Group>
              <Form.Label>Contest Name : </Form.Label>
              <Form.Control {...inputName} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Choose Mode : </Form.Label>
              <InputGroup>
                <Form.Control as='select' {...inputMode}>
                  <option selected value='unrated'>
                    Unrated Contest
                  </option>
                  <option value='rated'>Rated Contest</option>
                </Form.Control>
                <Form.Control as='select' {...inputJudge}>
                  <option selected value='classic'>
                    Classic (Time based)
                  </option>
                  <option value='acm'>ACM Mode</option>
                  <option disabled>OTOG Mode</option>
                  <option disabled>Blind Mode</option>
                </Form.Control>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Time : </Form.Label>
              <InputGroup as={Row} className='m-auto'>
                <Form.Control
                  as={DatePicker}
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date), setEndDate(date)
                  }}
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={30}
                  timeCaption='time'
                  dateFormat='d/MMMM/yyyy HH:mm'
                />
                <Col xs={1} />
                <Form.Control
                  as={DatePicker}
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={30}
                  timeCaption='time'
                  dateFormat='d/MMMM/yyyy HH:mm'
                />
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='success' onClick={onSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export const ContestConfig = ({ contestData: data, idContest }) => {
  const isSelected = idContest !== 0
  const [show, handleShow, handleClose] = useShow(false)
  const [contestData, setContestData] = useState(data)
  useEffect(() => {
    if (!show) {
      setContestData(data)
    }
  }, [show, data])
  const { name, mode, judge, startDate: start, endDate: end } = contestData

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  useEffect(() => {
    setStartDate(new Date(start * 1000))
    setEndDate(new Date(end * 1000))
  }, [start, end])

  const handleChangeName = (event) =>
    setContestData({ ...contestData, name: event.target.value })
  const handleChangeMode = (event) =>
    setContestData({ ...contestData, mode: event.target.value })
  const handleChangeJudge = (event) =>
    setContestData({ ...contestData, judge: event.target.value })
  const handleChangeStart = (date) =>
    setContestData({ ...contestData, startDate: date, endDate: date })
  const handleChangeEnd = (date) =>
    setContestData({ ...contestData, endDate: date })

  const patch = usePatch(`/api/admin/contest/${idContest}`)
  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    contestData.startDate = Math.floor(Date.parse(startDate) / 1000)
    contestData.endDate = Math.floor(Date.parse(endDate) / 1000)
    Object.keys(contestData).forEach((item) =>
      formData.append(item, contestData[item])
    )
    const res = await patch(formData, false)
    if (res.ok) {
      handleClose()
      mutate('/api/admin/contest')
    }
  }

  return (
    <>
      <Button
        variant='warning'
        className='ml-2'
        onClick={handleShow}
        disabled={!isSelected}
      >
        <FontAwesomeIcon icon={faCog} />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contest #{idContest}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Contest Name : </Form.Label>
              <Form.Control value={name} onChange={handleChangeName} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Choose Mode : </Form.Label>
              <InputGroup>
                <Form.Control as='select' onChange={handleChangeMode}>
                  <option value='unrated'>Unrated Contest</option>
                  <option value='rated'>Rated Contest</option>
                </Form.Control>
                <Form.Control as='select' onChange={handleChangeJudge}>
                  <option value='classic'>Classic (Time based)</option>
                  <option value='acm'>ACM Mode</option>
                  <option disabled>OTOG Mode</option>
                  <option disabled>Blind Mode</option>
                </Form.Control>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Time : </Form.Label>
              <InputGroup as={Row} className='m-auto'>
                <Form.Control
                  as={DatePicker}
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date), setEndDate(date)
                  }}
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={30}
                  timeCaption='time'
                  dateFormat='d/MMMM/yyyy HH:mm'
                />
                <Col xs={1} />
                <Form.Control
                  as={DatePicker}
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date)
                  }}
                  showTimeSelect
                  timeFormat='HH:mm'
                  timeIntervals={30}
                  timeCaption='time'
                  dateFormat='d/MMMM/yyyy HH:mm'
                />
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='success' onClick={onSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const ConfigTask = ({ id_Prob, see, idContest }) => {
  const [state, setState] = useState()
  useEffect(() => {
    setState(see)
  }, [see])

  const patch = usePatch(`/api/admin/contest/${idContest}/${id_Prob}`)
  const handleChangeState = async (event) => {
    event.preventDefault()
    setState(!state)
    const body = JSON.stringify({ state })
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

  const [data, setData] = useState(task)
  useEffect(() => {
    setData(task)
  }, [task])

  const { name, sname, memory, time, score, pdf, subtask, zip } = data

  const selectFile = (event) => {
    switch (event.target.id) {
      case 'doc':
        setData({ ...data, pdf: event.target.files[0] })
        break
      case 'testcase':
        setData({ ...data, zip: event.target.files[0] })
        break
    }
  }

  const handleChangeName = (event) =>
    setData({ ...data, name: event.target.value })
  const handleChangeSname = (event) =>
    setData({ ...data, sname: event.target.value })
  const handleChangeMemory = (event) =>
    setData({ ...data, memory: Number(event.target.value) ?? 0 })
  const handleChangeTime = (event) =>
    setData({ ...data, time: Number(event.target.value) ?? 0 })
  const handleChangeScore = (event) =>
    setData({ ...data, score: Number(event.target.value) ?? 0 })
  const handleChangeTestcase = (event) =>
    setData({ ...data, subtask: event.target.value })

  const post = usePost(`/api/admin/problem/${id_Prob}?option=save`)
  const onSave = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    Object.keys(data).forEach((item) => formData.append(item, data[item]))
    const response = await post(formData, false)
    if (response.ok) {
      handleClose()
      mutate('/api/admin/problem')
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
            <Form.Label>Time</Form.Label>
            <Form.Control defaultValue={time} onChange={handleChangeTime} />
          </Col>
          <Col xs={6}>
            <Form.Label>Memory</Form.Label>
            <Form.Control defaultValue={memory} onChange={handleChangeMemory} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col xs={6}>
            <Form.Label>Testcases</Form.Label>
            <Form.Control
              defaultValue={subtask}
              onChange={handleChangeTestcase}
            />
          </Col>
          <Col xs={6}>
            <Form.Label>Score</Form.Label>
            <Form.Control defaultValue={score} onChange={handleChangeScore} />
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.File
            id='doc'
            label={pdf?.name ?? 'New Document (PDF)'}
            accept='.pdf'
            onChange={selectFile}
            custom
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.File
            id='testcase'
            label={zip?.name ?? 'New Testcases (ZIP)'}
            accept='.zip'
            onChange={selectFile}
            custom
          />
        </Form.Group>
      </Form>
      <Modal.Footer>
        <Button variant='success' onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
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

  return (
    <>
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
          {tasks?.map((task) => (
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
