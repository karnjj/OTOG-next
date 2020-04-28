import { useState, useEffect } from 'react'
import { useTokenContext } from '../../utils/auth'
import fetch from 'isomorphic-unfetch'
import DatePicker from 'react-datepicker'
import {
	Table,
	Button,
	Modal,
	Form,
	Col,
	Row,
	InputGroup,
} from 'react-bootstrap'
import { Alink } from '../CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faEye,
	faEyeSlash,
	faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'

export const NewContest = () => {
	const token = useTokenContext()
	const [show, setShow] = useState(false)
	const [name, setName] = useState('')
	const [mode, setMode] = useState('unrated')
	const [judge, setJudge] = useState('classic')
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)
	const onSubmit = async (event) => {
		event.preventDefault()
		const start = Math.floor(Date.parse(startDate) / 1000)
		const end = Math.floor(Date.parse(endDate) / 1000)
		const data = { name, mode, judge, start, end }
		const url = `${process.env.API_URL}/api/admin/contest`
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? token : '',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) handleClose(), window.location.reload(false)
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
							<Form.Control
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Choose Mode : </Form.Label>
							<InputGroup>
								<Form.Control
									as='select'
									onChange={(e) => setMode(e.target.value)}
								>
									<option selected value='unrated'>
										Unrated Contest
									</option>
									<option value='rated'>Rated Contest</option>
								</Form.Control>
								<Form.Control
									as='select'
									onChange={(e) => setJudge(e.target.value)}
								>
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

const ConfigTask = (props) => {
	const { id_Prob, see, idContest } = props
	const [onoff, setOnoff] = useState(undefined)
	const token = useTokenContext()
	useEffect(() => {
		setOnoff(see)
	}, [see, idContest])
	const handleChangeState = async (event) => {
		event.preventDefault()
		const data = { idProb: id_Prob, state: !onoff }
		const url = `${process.env.API_URL}/api/admin/contest/${idContest}`
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? token : '',
			},
			body: JSON.stringify(data),
		})
		if (response.ok) setOnoff(!onoff)
	}
	return (
		<Button variant={onoff ? 'light' : 'dark'} onClick={handleChangeState}>
			<FontAwesomeIcon icon={onoff ? faEye : faEyeSlash} />
		</Button>
	)
}

const EditModal = (props) => {
	const token = useTokenContext()
	const { show, setShow } = props
	const { id_Prob } = props
	const [name, setName] = useState(props.name)
	const [sname, setSname] = useState(props.sname)
	const [memory, setMemory] = useState(props.memory)
	const [time, setTime] = useState(props.time)
	const [score, setScore] = useState(props.score)
	const [testcase, setTestcase] = useState(props.subtask)
	const handleClose = () => setShow(false)
	const [docName, setDocName] = useState('')
	const [selectedDoc, setSelectedDoc] = useState(undefined)
	const [testcaseName, setTestcaseName] = useState('')
	const [selectedTestcase, setSelectedTestcase] = useState(undefined)
	const selectFile = (event) => {
		if (event.target.files[0] === undefined) {
			setSelectedFile(undefined)
			setFileName('')
			return
		}
		switch (event.target.id) {
			case 'doc':
				setSelectedDoc(event.target.files[0])
				setDocName(event.target.files[0].name)
				break
			case 'testcase':
				setSelectedTestcase(event.target.files[0])
				setTestcaseName(event.target.files[0].name)
				break
		}
	}
	const handleChangeName = (event) => setName(event.target.value)
	const handleChangeSname = (event) => setSname(event.target.value)
	const handleChangeMemory = (event) => setMemory(Number(event.target.value))
	const handleChangeTime = (event) => setTime(Number(event.target.value))
	const handleChangeScore = (event) => setScore(Number(event.target.value))
	const handleChangeTestcase = (event) => setTestcase(event.target.value)
	const onSave = async (event) => {
		event.preventDefault()
		const info = { name, sname, memory, time, testcase, score }
		const data = new FormData()
		Object.keys(info).map((item) => {
			data.append(item, info[item])
		})
		data.append('pdf', selectedDoc)
		data.append('zip', selectedTestcase)
		const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?option=save`
		const response = await fetch(url, {
			method: 'POST',
			headers: { Authorization: token ? token : '' },
			body: data,
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
							defaultValue={testcase}
							onChange={handleChangeTestcase}
							disabled
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
						label={docName || 'New Document (PDF)'}
						accept='.pdf'
						onChange={selectFile}
						custom
						required
					/>
				</Form.Group>
				<Form.Group>
					<Form.File
						id='testcase'
						label={testcaseName || 'New Testcases (ZIP)'}
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

const TaskTr = (props) => {
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

export const SelectContest = (props) => {
	const { contests, setId } = props
	return (
		<Form.Group>
			<Form.Label>Choose Contest : </Form.Label>
			<Form.Control as='select' onChange={setId}>
				<option disabled selected>
					{' '}
					-- select a contest --{' '}
				</option>
				{contests.map((contest, index) => {
					return (
						<option key={index} value={contest.idContest}>
							{' '}
							{contest.name}
						</option>
					)
				})}
			</Form.Control>
		</Form.Group>
	)
}

export const TaskTable = ({ idContest }) => {
	const token = useTokenContext()
	const [tasks, setTasks] = useState([])
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/admin/contest/${idContest}`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = token ? token : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setTasks(json)
		}
		fetchData()
		return function cleanup() {
			setTasks([])
		}
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
