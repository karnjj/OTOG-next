import { useState, useEffect } from 'react'
import { useAuthContext } from '../../utils/auth'
import fetch from 'isomorphic-unfetch'
import { useGet } from '../../utils/api'
import DatePicker from 'react-datepicker'
import { Button, Modal, Form, Col, Row, InputGroup } from 'react-bootstrap'
import { Alink } from '../CustomText'
import { CustomTable } from '../CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faEye, faEyeSlash, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

export const NewContest = () => {
	const { token } = useAuthContext()
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
			<Button variant="success" size="lg" onClick={handleShow}>
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
									as="select"
									onChange={(e) => setMode(e.target.value)}
								>
									<option selected value="unrated">
										Unrated Contest
									</option>
									<option value="rated">Rated Contest</option>
								</Form.Control>
								<Form.Control
									as="select"
									onChange={(e) => setJudge(e.target.value)}
								>
									<option selected value="classic">
										Classic (Time based)
									</option>
									<option value="acm">ACM Mode</option>
									<option disabled>OTOG Mode</option>
									<option disabled>Blind Mode</option>
								</Form.Control>
							</InputGroup>
						</Form.Group>
						<Form.Group>
							<Form.Label>Time : </Form.Label>
							<InputGroup as={Row} className="m-auto">
								<Form.Control
									as={DatePicker}
									selected={startDate}
									onChange={(date) => {
										setStartDate(date), setEndDate(date)
									}}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={30}
									timeCaption="time"
									dateFormat="d/MMMM/yyyy HH:mm"
								/>
								<Col xs={1} />
								<Form.Control
									as={DatePicker}
									selected={endDate}
									onChange={(date) => setEndDate(date)}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={30}
									timeCaption="time"
									dateFormat="d/MMMM/yyyy HH:mm"
								/>
							</InputGroup>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="success" onClick={onSubmit}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export const ContestConfig = ({ idContest }) => {
	const isSelected = idContest !== 0
	const [data] = useGet(
		`/api/admin/contest/${idContest}?mode=config`,
		[idContest],
		isSelected
	)
	const [contestData, setContestData] = useState(data)
	const { name, mode, judge, startDate, endDate } = contestData ?? {}

	const [show, setShow] = useState(false)

	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)

	const handleChangeName = (event) =>
		setContestData({ ...contestData, name: event.target.value })
	const handleChangeMode = (event) =>
		setContestData({ ...contestData, mode: event.target.value })
	const handleChangeJudge = (event) =>
		setContestData({ ...contestData, judge: event.target.value })
	const handleChangeStart = (date) =>
		setContestData({ ...contestData, startDate: date, endDate: date })
	const handleChangeEnd = (date) => setContestData({ ...contestData, endDate: date })

	const onSubmit = async (event) => {
		event.preventDefault()
		const url = `${process.env.API_URL}/api/admin/contest/${idContest}?mode=config`
		const formData = new FormData()
		Object.keys(contestData).forEach((item) =>
			formData.append(item, contestData[item])
		)
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ?? '',
			},
			body: formData,
		})
		if (response.ok) {
			handleClose()
			window.location.reload(false)
		}
	}

	return (
		<>
			<Button
				variant="warning"
				className="ml-2"
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
								<Form.Control as="select" onChange={handleChangeMode}>
									<option value="unrated">Unrated Contest</option>
									<option value="rated">Rated Contest</option>
								</Form.Control>
								<Form.Control as="select" onChange={handleChangeJudge}>
									<option value="classic">Classic (Time based)</option>
									<option value="acm">ACM Mode</option>
									<option disabled>OTOG Mode</option>
									<option disabled>Blind Mode</option>
								</Form.Control>
							</InputGroup>
						</Form.Group>
						<Form.Group>
							<Form.Label>Time : </Form.Label>
							<InputGroup as={Row} className="m-auto">
								<Form.Control
									as={DatePicker}
									selected={startDate}
									onChange={handleChangeStart}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={30}
									timeCaption="time"
									dateFormat="d/MMMM/yyyy HH:mm"
								/>
								<Col xs={1} />
								<Form.Control
									as={DatePicker}
									selected={endDate}
									onChange={handleChangeEnd}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={30}
									timeCaption="time"
									dateFormat="d/MMMM/yyyy HH:mm"
								/>
							</InputGroup>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="success" onClick={onSubmit}>
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
	const { token } = useAuthContext()
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
	const { token } = useAuthContext()
	const { show, setShow, id_Prob, ...rest } = props

	const [data, setData] = useState(rest)
	const { name, sname, memory, time, score, pdf, testcase, zip } = data

	const handleClose = () => setShow(false)
	const selectFile = (event) => {
		if (event.target.files[0] === undefined) {
			setData({ ...data, pdf: undefined, zip: undefined })
			return
		}
		switch (event.target.id) {
			case 'doc':
				setData({ ...data, pdf: event.target.files[0] })
				break
			case 'testcase':
				setData({ ...data, zip: event.target.files[0] })
				break
		}
	}
	const handleChangeName = (event) => setData({ ...data, name: event.target.value })
	const handleChangeSname = (event) => setData({ ...data, sname: event.target.value })
	const handleChangeMemory = (event) =>
		setData({ ...data, memory: Number(event.target.value) ?? '' })
	const handleChangeTime = (event) =>
		setData({ ...data, time: Number(event.target.value) ?? '' })
	const handleChangeScore = (event) =>
		setData({ ...data, score: Number(event.target.value) ?? '' })
	const handleChangeTestcase = (event) =>
		setData({ ...data, testcase: event.target.value })

	const onSave = async (event) => {
		event.preventDefault()
		const formData = new FormData()
		Object.keys(info).map((item) => {
			formData.append(item, info[item])
		})
		const url = `${process.env.API_URL}/api/admin/problem/${id_Prob}?option=save`
		const response = await fetch(url, {
			method: 'POST',
			headers: { Authorization: token ? token : '' },
			body: formData,
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
						<Form.Control
							defaultValue={memory}
							onChange={handleChangeMemory}
						/>
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Col xs={6}>
						<Form.Label>Testcases</Form.Label>
						<Form.Control
							defaultValue={testcase}
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
						id="doc"
						label={pdf?.name ?? 'New Document (PDF)'}
						accept=".pdf"
						onChange={selectFile}
						custom
						required
					/>
				</Form.Group>
				<Form.Group>
					<Form.File
						id="testcase"
						label={zip?.name ?? 'New Testcases (ZIP)'}
						accept=".zip"
						onChange={selectFile}
						custom
					/>
				</Form.Group>
			</Form>
			<Modal.Footer>
				<Button variant="success" onClick={onSave}>
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
				<Alink target="_blank" href={`${process.env.API_URL}/api/docs/${sname}`}>
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

export const SelectContest = ({ contests, setId }) => (
	<Form.Group>
		<Form.Label>Choose Contest : </Form.Label>
		<Form.Control as="select" onChange={setId}>
			<option disabled selected>
				select a contest
			</option>
			{contests?.map((contest, index) => {
				return (
					<option key={index} value={contest.idContest}>
						{contest.name}
					</option>
				)
			})}
		</Form.Control>
	</Form.Group>
)

export const TaskTable = ({ idContest }) => {
	const [tasks] = useGet(`/api/admin/contest/${idContest}`)

	return (
		<CustomTable ready={!!tasks}>
			<thead className="thead-light">
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
				{tasks?.map((task, index) => (
					<TaskTr key={index} {...task} idContest={idContest} />
				))}
			</tbody>
		</CustomTable>
	)
}
