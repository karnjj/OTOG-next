import { useState, useEffect } from 'react'
import { useAuthContext, useTokenContext } from '../../utils/auth'
import fetch from 'isomorphic-unfetch'

import {
	Table,
	ButtonGroup,
	Button,
	Modal,
	Form,
	Col,
	Row,
	InputGroup
} from 'react-bootstrap'
import { Alink } from '../CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPencilAlt,
	faSyncAlt,
	faEye,
	faEyeSlash,
	faTrash,
	faPlusCircle
} from '@fortawesome/free-solid-svg-icons'

export const NewProblem = () => {
	const [show, setShow] = useState(false)
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)
	const onSubmit = async event => {
		event.preventDefault()
		handleClose()
	}

	return (
		<>
			<Button variant='success' size='lg' onClick={handleShow}>
				<FontAwesomeIcon icon={faPlusCircle} /> New Problem
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add New Problem</Modal.Title>
				</Modal.Header>
				<Form as={Modal.Body}>
					<Form.Group>
						<Form.Label>Description : </Form.Label>
						<InputGroup>
							<Form.Control placeholder='Display Name' />
							<Form.Control placeholder='Short Name' />
						</InputGroup>
					</Form.Group>

					<Form.Group>
						<Form.File
							label={/*fileName || */ 'Document (PDF)'}
							accept='.pdf'
							// onChange={selectFile}
							custom
						/>
					</Form.Group>
					<Form.Group>
						<Form.File
							label={/*fileName || */ 'Testcases (ZIP)'}
							accept='.zip'
							// onChange={selectFile}
							custom
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Constraint : </Form.Label>
						<InputGroup>
							<Form.Control placeholder='Time Limit (s)' />
							<Form.Control placeholder='Memory (MB)' />
						</InputGroup>
					</Form.Group>

					<Form.Group>
						<InputGroup>
							<Form.Control placeholder='Testcases e.g.[PPPPP][PPPPP]' />
							<Form.Control placeholder='Score' />
						</InputGroup>
					</Form.Group>
				</Form>
				<Modal.Footer>
					<Button variant='success' onClick={onSubmit}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

const ConfigTask = props => {
	const token = useTokenContext()
	const { id_Prob, handleShow, state } = props
	const [onoff, setOnoff] = useState(state)
	const handleChangeState = async event => {
		event.preventDefault()
		const data = { onoff }
		const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?option=onoff`
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json',
						'Authorization': token ? token : '' },
			body: JSON.stringify(data)
		})
		if (response.ok) setOnoff(!onoff)
	}
	return (
		<ButtonGroup>
			<Button variant='info' onClick={handleShow}>
				<FontAwesomeIcon icon={faPencilAlt} />
			</Button>
			<Button variant='warning'>
				<FontAwesomeIcon icon={faSyncAlt} />
			</Button>
			<Button variant={onoff ? 'light' : 'dark'} onClick={handleChangeState}>
				<FontAwesomeIcon icon={onoff ? faEye : faEyeSlash} />
			</Button>
			<Button variant='danger'>
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		</ButtonGroup>
	)
}

const EditModal = props => {
	const token = useTokenContext()
	const { show, setShow } = props
	const { id_Prob } = props
	const [name, setName] = useState(props.name)
	const [sname, setSname] = useState(props.sname)
	const [memory, setMemory] = useState(props.memory)
	const [time, setTime] = useState(props.time)
	const [score, setScore] = useState(props.score)
	const handleClose = () => setShow(false)

	const handleChangeName = event => {
		setName(event.target.value)
	}
	const handleChangeSname = event => {
		setSname(event.target.value)
	}
	const handleChangeMemory = event => {
		setMemory(Number(event.target.value))
	}
	const handleChangeTime = event => {
		setTime(Number(event.target.value))
	}
	const handleChangeScore = event => {
		setScore(Number(event.target.value))
	}
	const onSave = async event => {
		event.preventDefault()
		const data = { name, sname, memory, time, score }
		const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?option=save`
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json',
						'Authorization': token ? token : '' },
			body: JSON.stringify(data)
		})
		if (response.ok) handleClose(), window.location.reload(false)
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Problem #{id_Prob}</Modal.Title>
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
					<Col xs={4}>
						<Form.Label>Time</Form.Label>
						<Form.Control defaultValue={time} onChange={handleChangeTime} />
					</Col>
					<Col xs={4}>
						<Form.Label>Memory</Form.Label>
						<Form.Control defaultValue={memory} onChange={handleChangeMemory} />
					</Col>
					<Col xs={4}>
						<Form.Label>Score</Form.Label>
						<Form.Control defaultValue={score} onChange={handleChangeScore} />
					</Col>
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

const TaskTr = props => {
	const { id_Prob, name, sname, memory, time, score } = props
	const [show, setShow] = useState(false)
	const handleShow = () => setShow(true)

	return (
		<tr onDoubleClick={handleShow}>
			<td>{id_Prob}</td>
			<td>
				<Alink
					target='_blank'
					href={`${process.env.API_URL}/api/docs/${sname}`}
				>
					{name}
				</Alink>
			</td>
			<td>{time}</td>
			<td>{memory}</td>
			<td>{score}</td>
			<td>
				<ConfigTask {...props} {...{ handleShow }} />
				<EditModal {...props} {...{ setShow, show }} />
			</td>
		</tr>
	)
}

export const TaskTable = props => {
	const userData = useAuthContext()
	const token = useTokenContext()
	const [tasks, setTasks] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/admin/problem`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = token ? token : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setTasks(json)
		}
		fetchData()
	}, [])

	return (
		<Table responsive hover>
			<thead className='thead-light'>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Time</th>
					<th>Memory</th>
					<th>Score</th>
					<th>Config</th>
				</tr>
			</thead>
			<tbody>
				{tasks.map((task, index) => (
					<TaskTr key={index} {...task} />
				))}
			</tbody>
		</Table>
	)
}
