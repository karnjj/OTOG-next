import { useState, useEffect } from 'react'
import { useAuthContext } from '../../utils/auth'
import { useGet } from '../../utils/api'
import { CustomTable } from '../CustomTable'
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
import { Alink } from '../CustomText'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPencilAlt,
	faSyncAlt,
	faEye,
	faEyeSlash,
	faTrash,
	faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { useSwitch } from '../../utils'

export const NewProblem = () => {
	const { token } = useAuthContext()

	const [show, handleShow, handleClose] = useSwitch(false)
	const [data, setData] = useState({})
	const {
		name = '',
		sname = '',
		numCase = '',
		memory,
		time,
		score,
		pdf,
		zip,
	} = data

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
		setData({ ...data, memory: Number(event.target.value) ?? '' })
	const handleChangeTime = (event) =>
		setData({ ...data, time: Number(event.target.value) ?? '' })
	const handleChangeNumCase = (event) =>
		setData({ ...data, numCase: Number(event.target.value) ?? '' })
	const handleChangeScore = (event) =>
		setData({ ...data, score: Number(event.target.value) ?? '' })

	const onSubmit = async (event) => {
		event.preventDefault()
		const formData = new FormData()
		Object.keys(data).map((item) => {
			formData.append(item, data[item])
		})
		const url = `${process.env.API_URL}/api/admin/problem`
		const response = await fetch(url, {
			method: 'POST',
			headers: { Authorization: token ? token : '' },
			body: formData,
		})
		if (response.ok) {
			handleClose()
			window.location.reload(false)
		}
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
								label={pdf?.name ?? 'Document (PDF)'}
								accept='.pdf'
								onChange={selectFile}
								custom
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.File
								id='testcase'
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

const ConfigTask = ({ id_Prob, handleShow, state, sname }) => {
	const { token } = useAuthContext()
	const [onoff, setOnoff] = useState(state)

	const handleChangeState = async (event) => {
		event.preventDefault()
		const data = { onoff }
		const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?option=onoff`
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

	const handleDelete = async () => {
		if (confirm(`Delete problem id : ${id_Prob}`)) {
			const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?sname=${sname}`
			const respone = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: token ? token : '',
				},
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

const EditModal = (props) => {
	const { token } = useAuthContext()
	const { show, handleClose, id_Prob, refreshData, ...rest } = props
	const [data, setData] = useState(rest)
	const { name, sname, memory, time, score, rating, subtask, pdf, zip } = data
	const [isSaving, handleSaving] = useSwitch(false)

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
		setData({ ...data, memory: Number(event.target.value) ?? '' })
	const handleChangeTime = (event) =>
		setData({ ...data, time: Number(event.target.value) ?? '' })
	const handleChangeScore = (event) =>
		setData({ ...data, score: Number(event.target.value) ?? '' })
	const handleChangeRating = (event) =>
		setData({ ...data, rating: event.target.value })
	const handleChangeSubtask = (event) =>
		setData({ ...data, subtask: event.target.value })

	const onSave = async (event) => {
		event.preventDefault()
		handleSaving()
		const formData = new FormData()
		Object.keys(data).map((item) => {
			formData.append(item, data[item])
		})
		const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?option=save`
		const response = await fetch(url, {
			method: 'POST',
			headers: { Authorization: token ? token : '' },
			body: formData,
		})
		if (response.ok) {
			refreshData()
		}
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
				<Button variant='success' onClick={onSave} disabled={isSaving}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

const TaskTr = (props) => {
	const { id_Prob, name, sname, memory, time, rating, noTestcase } = props
	const [show, handleShow, handleClose] = useSwitch(false)

	return (
		<tr onDoubleClick={handleShow}>
			<td>{id_Prob}</td>
			<td>
				<Alink
					target='_blank'
					href={`${process.env.API_URL}/api/docs/${sname}`}
				>
					{name}
				</Alink>{' '}
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
}

export const TaskTable = () => {
	const { data: tasks, execute } = useGet('/api/admin/problem')

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
					<TaskTr key={index} {...task} refreshData={execute} />
				))}
			</tbody>
		</CustomTable>
	)
}
