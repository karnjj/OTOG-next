import { useState, useEffect } from 'react'
import { useAuthContext, useTokenContext } from '../../utils/auth'
import fetch from 'isomorphic-unfetch'

import { Table, ButtonGroup, Button, Modal, Form, Toast } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPencilAlt,
	faTrash,
	faUserPlus
} from '@fortawesome/free-solid-svg-icons'

export const NewUser = () => {
	const token = useTokenContext()
	const [show, setShow] = useState(false)
	const [showErr, setShowErr] = useState(false);
	const [username, setUsername] = useState('')
	const [sname, setSname] = useState('')
	const [password, setPassword] = useState('')
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)
	const toggleShowErr = () => setShowErr(!showErr);
	const handleChangeUserame = e => setUsername(e.target.value)
	const handleChangePassword = e => setPassword(e.target.value)
	const handleChangeSname = e => setSname(e.target.value)
	const onSubmit = async event => {
		event.preventDefault()
		const data = { username, password, sname }
		const url = `${process.env.API_URL}/api/admin/user`
		const respone = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token ? token : ''
			},
			body: JSON.stringify(data)
		})
		if (respone.ok) handleClose(), window.location.reload(false)
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
						<Form.Control placeholder='Username' onChange={handleChangeUserame} />
						<br />
						<Form.Control placeholder='Password' type='password' onChange={handleChangePassword} />
						<br />
						<Form.Control placeholder='Display Name' onChange={handleChangeSname} />
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
	const token = useTokenContext()
	const { handleShow, idUser } = props
	const handleDelete = async () => {
		if (confirm(`Delete user id : ${idUser}`)) {
			const url = `${process.env.API_URL}/api/admin/user/${idUser}`
			const respone = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
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
			<Button variant='danger' onClick={handleDelete}>
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		</ButtonGroup>
	)
}

const EditModal = props => {
	const token = useTokenContext()
	const { show, setShow } = props
	const { idUser } = props
	const [username, setUsername] = useState(props.username)
	const [sname, setSname] = useState(props.sname)
	const [state, setState] = useState(props.state)
	const [password, setPassword] = useState('')
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
	const handleChangePassword = event => {
		setPassword(event.target.value)
	}
	const onSave = async event => {
		event.preventDefault()
		const data = { username, sname, state, password }
		const url = `${process.env.API_URL}/api/admin/user/${idUser}`
		const respone = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token ? token : ''
			},
			body: JSON.stringify(data)
		})
		if (respone.ok) handleClose(), window.location.reload(false)
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
					<Form.Label>New Password : </Form.Label>
					<Form.Control
						placeholder='New Password'
						onChange={handleChangePassword}
					/>
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
	const token = useTokenContext()
	const [users, setUsers] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/admin/user`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = token ? token : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setUsers(json)
		}
		fetchData()
		return function cleanup() {
			setUsers([])
		}
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
