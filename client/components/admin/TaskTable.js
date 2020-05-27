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
	InputGroup,
	Badge
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
	const token = useTokenContext()

	const [show, setShow] = useState(false)
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)

	const [name, setName] = useState('')
	const [sname, setSname] = useState('')
	const [memory, setMemory] = useState()
	const [time, setTime] = useState()
	const [numCase, setNumCase] = useState()
	const [score, setScore] = useState()
	const [docName, setDocName] = useState('')
	const [selectedDoc, setSelectedDoc] = useState(undefined)
	const [testcaseName, setTestcaseName] = useState('')
	const [selectedTestcase, setSelectedTestcase] = useState(undefined)
	const selectFile = event => {
		if (event.target.files[0] === undefined) {
			setSelectedFile(undefined)
			setFileName('')
			return
		}
		switch (event.target.id) {
			case 'doc':
				setSelectedDoc(event.target.files[0])
				setDocName(event.target.files[0].name)
				break;
			case 'testcase':
				setSelectedTestcase(event.target.files[0])
				setTestcaseName(event.target.files[0].name)
				break;
		}
	}
	const handleChangeName = event => setName(event.target.value)
	const handleChangeSname = event => setSname(event.target.value)
	const handleChangeMemory = event => setMemory(Number(event.target.value))
	const handleChangeTime = event => setTime(Number(event.target.value))
	const handleChangeNumCase = event => setNumCase(Number(event.target.value))
	const handleChangeScore = event => setScore(Number(event.target.value))
	const onSubmit = async event => {
		event.preventDefault()
		const info = { name, sname, memory, time, numCase, score }
		const data = new FormData()
		Object.keys(info).map((item) => {
			data.append(item, info[item])
		});
		data.append('pdf', selectedDoc)
		data.append('zip', selectedTestcase)
		const url = `${process.env.API_URL}/api/admin/problem`
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Authorization': token ? token : '' },
			body: data
		})
		if (response.ok) handleClose(), window.location.reload(false)
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
								id='doc'
								label={docName || 'Document (PDF)'}
								accept='.pdf'
								onChange={selectFile}
								custom
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.File
								id='testcase'
								label={testcaseName || 'Testcases (ZIP)'}
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

const ConfigTask = props => {
	const token = useTokenContext()
	const { id_Prob, handleShow, state, sname } = props
	const [onoff, setOnoff] = useState(state)
	const handleChangeState = async event => {
		event.preventDefault()
		const data = { onoff }
		const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?option=onoff`
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token ? token : ''
			},
			body: JSON.stringify(data)
		})
		if (response.ok) setOnoff(!onoff)
	}
	const handleDelete = async () => {
		if (confirm(`Delete problem id : ${id_Prob}`)) {
			const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?sname=${sname}`
			const respone = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Authorization': token ? token : ''
				}
			})
			if (respone.ok) window.location.reload(false)
		}
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
			<Button variant='danger' onClick={handleDelete}>
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		</ButtonGroup>
	)
}

const EditModal = props => {
	const token = useTokenContext()
	const { show, setShow } = props
	const { id_Prob } = props
	const [isSaving, setIsSaving] = useState(false)
	const [name, setName] = useState(props.name)
	const [sname, setSname] = useState(props.sname)
	const [memory, setMemory] = useState(props.memory)
	const [time, setTime] = useState(props.time)
	const [score, setScore] = useState(props.score)
	const [rating, setRating] = useState(props.rating)
	const [testcase, setTestcase] = useState(props.subtask)
	const handleClose = () => setShow(false)
	const [docName, setDocName] = useState('')
	const [selectedDoc, setSelectedDoc] = useState(undefined)
	const [testcaseName, setTestcaseName] = useState('')
	const [selectedTestcase, setSelectedTestcase] = useState(undefined)
	const selectFile = event => {
		if (event.target.files[0] === undefined) {
			setSelectedFile(undefined)
			setFileName('')
			return
		}
		switch (event.target.id) {
			case 'doc':
				setSelectedDoc(event.target.files[0])
				setDocName(event.target.files[0].name)
				break;
			case 'testcase':
				setSelectedTestcase(event.target.files[0])
				setTestcaseName(event.target.files[0].name)
				break;
		}
	}
	const handleChangeName = event => setName(event.target.value)
	const handleChangeSname = event => setSname(event.target.value)
	const handleChangeMemory = event => setMemory(Number(event.target.value))
	const handleChangeTime = event => setTime(Number(event.target.value))
	const handleChangeScore = event => setScore(Number(event.target.value))
	const handleChangeRating = event => setRating(event.target.value)
	const handleChangeTestcase = event => setTestcase(event.target.value)
	const onSave = async event => {
		event.preventDefault()
		setIsSaving(true)
		const info = { name, sname, memory, time, testcase, score, rating }
		const data = new FormData()
		Object.keys(info).map((item) => {
			data.append(item, info[item])
		});
		data.append('pdf', selectedDoc)
		data.append('zip', selectedTestcase)
		const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?option=save`
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Authorization': token ? token : '' },
			body: data
		})
		if (response.ok) props.refreshData().then(() => {
			handleClose()
			setIsSaving(false)
		})

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
						<Form.Control defaultValue={testcase} onChange={handleChangeTestcase} />
					</Col>
					<Col xs={6}>
						<Form.Label>Score</Form.Label>
						<Form.Control defaultValue={score} onChange={handleChangeScore} />
					</Col>
				</Form.Group>
				<Form.Group>
					<InputGroup>
						<InputGroup.Prepend>
							<InputGroup.Text >Rating</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control
							placeholder="eg.1500"
							defaultValue={rating}
							onChange={handleChangeRating}
						/>
					</InputGroup>
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
				<Button variant='success' onClick={onSave} disabled={isSaving ? true : false}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

const TaskTr = props => {
	const { id_Prob, name, sname, memory, time, rating, noTestcase } = props
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
				{' '}
				{(noTestcase) && <Badge variant="warning">No Testcases</Badge>}
			</td>
			<td>{time}</td>
			<td>{memory}</td>
			<td>{(rating == null) ? '-' : rating}</td>
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

	const fetchData = async () => {
		console.log('pass');

		const url = `${process.env.API_URL}/api/admin/problem`
		let headers = { 'Content-Type': 'application/json' }
		headers['Authorization'] = token ? token : ''
		const res = await fetch(url, { headers })
		const json = await res.json()
		setTasks(json)
	}

	const refreshData = () => fetchData()

	useEffect(() => {
		fetchData()
		return function cleanup() {
			setTasks([])
		}
	}, [])

	return (
		<Table responsive hover>
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
				{tasks.map((task, index) => (
					<TaskTr key={index} {...task} refreshData={refreshData} />
				))}
			</tbody>
		</Table>
	)
}
