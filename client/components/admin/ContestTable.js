import { useState, useEffect } from 'react'
import { useAuthContext } from '../../utils/auth'
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

export const NewContest = () => {
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
				<FontAwesomeIcon icon={faPlusCircle} /> New Contest
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add New Contest</Modal.Title>
				</Modal.Header>
				<Form as={Modal.Body}>
					<Form.Group>
						<Form.Label>Contest Name : </Form.Label>
						<Form.Control placeholder='' />
					</Form.Group>

					<Form.Group>
						<Form.Label>Choose Mode : </Form.Label>
						<InputGroup>
							<Form.Control as='select'>
								<option>Unrated Contest</option>
								<option>Rated Contest</option>
							</Form.Control>
							<Form.Control as='select'>
								<option>Classic (Time base)</option>
								<option>ACM Mode</option>
								<option disabled>OTOG Mode</option>
								<option disabled>Blind Mode</option>
							</Form.Control>
						</InputGroup>
					</Form.Group>
					<Form.Group>
						<Form.Label>Time : </Form.Label>
						<InputGroup>
							<Form.Control placeholder='Start' />
							<Form.Control placeholder='End' />
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
	const { id_Prob, see, idContest } = props
	const [onoff, setOnoff] = useState(undefined)
	useEffect(() => {
		setOnoff(see)
	},[see,idContest])
	const handleChangeState = async event => {
		event.preventDefault()
		const data = { idProb: id_Prob, state : !onoff }
		const url = `${process.env.API_URL}/api/admin/contest/${idContest}`
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
		if (response.ok) setOnoff(!onoff)
	}
	return (
		<Button variant={onoff ? 'light' : 'dark'} onClick={handleChangeState}>
			<FontAwesomeIcon icon={onoff ? faEye : faEyeSlash} />
		</Button>
	)
}

const EditModal = props => {
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
			headers: { 'Content-Type': 'application/json' },
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
				<ConfigTask {...props} />
				<EditModal {...props} {...{ setShow, show }} />
			</td>
		</tr>
	)
}

export const SelectContest = props => {
	const { contests, setId } = props
	return (
		<Form.Group>
			<Form.Label>Choose Contest : </Form.Label>
			<Form.Control as='select' onChange={setId} >
				<option disabled selected > -- select a contest -- </option>
				{contests.map((contest,index) => {
					return (
						<option key={index} value={contest.idContest}> {contest.name}</option>
					)
				})}
			</Form.Control>
		</Form.Group>
	)
}

export const TaskTable = ({ idContest }) => {
	const userData = useAuthContext()
	const [tasks, setTasks] = useState([])
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/admin/contest/${idContest}`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setTasks(json)
		}
		fetchData()
	}, [idContest])
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
					<TaskTr key={index} {...task} idContest={idContest} />
				))}
			</tbody>
		</Table>
	)
}
