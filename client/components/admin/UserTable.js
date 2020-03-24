import { useState, useEffect } from 'react'
import { useAuthContext } from '../../utils/auth'
import fetch from 'isomorphic-unfetch'

import { Table, ButtonGroup, Button, Modal, Form } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPencilAlt,
	faTrash,
	faUserPlus
} from '@fortawesome/free-solid-svg-icons'

export const NewUser = () => {
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
				<FontAwesomeIcon icon={faUserPlus} /> New User
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add New User</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Control placeholder='Username' />
						<br />
						<Form.Control placeholder='Password' type='password' />
						<br />
						<Form.Control placeholder='Display Name' />
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

const ConfigUser = props => {
	const { handleShow } = props
	return (
		<ButtonGroup>
			<Button variant='info' onClick={handleShow}>
				<FontAwesomeIcon icon={faPencilAlt} />
			</Button>
			<Button variant='danger'>
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		</ButtonGroup>
	)
}

const EditModal = props => {
	const { show, setShow } = props
	const { idUser } = props
	const [username, setUsername] = useState(props.username)
	const [sname, setSname] = useState(props.sname)
	const [state, setState] = useState(props.state)
	const handleClose = () => setShow(false)

	const handleChangeUserame = event => {
		setUsername(event.target.value)
	}
	const handleChangeSname = event => {
		setSname(event.target.value)
	}
	const handleChangeState = event => {
		setState(Number(event.target.value))
	}
	const onSave = async event => {
		event.preventDefault()
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>User #{idUser}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Label>Username : </Form.Label>
					<Form.Control
						defaultValue={username}
						onChange={handleChangeUserame}
					/>
					<br />
					<Form.Label>Display Name : </Form.Label>
					<Form.Control defaultValue={sname} onChange={handleChangeSname} />
					<br />
					<Form.Label>User Level : </Form.Label>
					<Form.Control defaultValue={state} onChange={handleChangeState} />
					<br />
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='success' onClick={onSave}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

const UserTr = props => {
	const { idUser, username, sname, state } = props
	const [show, setShow] = useState(false)
	const handleShow = () => setShow(true)

	return (
		<tr onDoubleClick={handleShow}>
			<td>{idUser}</td>
			<td>{username}</td>
			<td>{sname}</td>
			<td>{state}</td>
			<td>
				<ConfigUser {...props} {...{ handleShow }} />
				<EditModal {...props} {...{ setShow, show }} />
			</td>
		</tr>
	)
}

export const UserTable = props => {
	const userData = useAuthContext()
	const [users, setUsers] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/admin/user`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setUsers(json)
			console.log(json)
		}
		fetchData()
	}, [])

	return (
		<Table responsive hover>
			<thead className='thead-light'>
				<tr>
					<th>#</th>
					<th>Username</th>
					<th>Display Name</th>
					<th>Level</th>
					<th>Config</th>
				</tr>
			</thead>
			<tbody>
				{users.map((task, index) => (
					<UserTr key={index} {...task} />
				))}
			</tbody>
		</Table>
	)
}
