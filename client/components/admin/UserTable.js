import { useAuthContext } from '../../utils/auth'
import fetch from 'isomorphic-unfetch'

import { ButtonGroup, Button, Modal, Form } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPencilAlt,
	faTrash,
	faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { useGet } from '../../utils/api'
import { useSwitch, useInput } from '../../utils'
import { CustomTable } from '../CustomTable'

export const NewUser = () => {
	const { token } = useAuthContext()
	const [show, handleShow, handleClose] = useSwitch(false)
	const [username, inputUsername] = useInput()
	const [password, inputPassword] = useInput()
	const [sname, inputSname] = useInput()

	const onSubmit = async (event) => {
		event.preventDefault()
		const data = { username, password, sname }
		const url = `${process.env.API_URL}/api/admin/user`
		const respone = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? token : '',
			},
			body: JSON.stringify(data),
		})
		if (respone.ok) {
			handleClose()
			window.location.reload(false)
		}
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
						<Form.Control placeholder='Username' {...inputUsername} />
						<br />
						<Form.Control
							type='password'
							placeholder='Password'
							{...inputPassword}
						/>
						<br />
						<Form.Control placeholder='Display Name' {...inputSname} />
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

const ConfigUser = ({ handleShow, idUser }) => {
	const { token } = useAuthContext()

	const handleDelete = async () => {
		if (confirm(`Delete user id : ${idUser}`)) {
			const url = `${process.env.API_URL}/api/admin/user/${idUser}`
			const respone = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
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
			<Button variant='danger' onClick={handleDelete}>
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		</ButtonGroup>
	)
}

const EditModal = (props) => {
	const { token } = useAuthContext()
	const { show, handleClose, idUser } = props
	const [username, inputUsername] = useInput(props.username)
	const [password, inputPassword] = useInput()
	const [sname, inputSname] = useInput(props.sname)
	const [state, inputState] = useInput(props.state, (val) => Number(val))

	const onSave = async (event) => {
		event.preventDefault()
		const data = { username, sname, state, password }
		const url = `${process.env.API_URL}/api/admin/user/${idUser}`
		const respone = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token ? token : '',
			},
			body: JSON.stringify(data),
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
					<Form.Control {...inputUsername} />
					<br />
					<Form.Label>Display Name : </Form.Label>
					<Form.Control {...inputSname} />
					<br />
					<Form.Label>User Level : </Form.Label>
					<Form.Control {...inputState} />
					<br />
					<Form.Label>New Password : </Form.Label>
					<Form.Control placeholder='New Password' {...inputPassword} />
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

const UserTr = (props) => {
	const { idUser, username, sname, state } = props
	const [show, handleShow, handleClose] = useSwitch(false)

	return (
		<tr onDoubleClick={handleShow}>
			<td>{idUser}</td>
			<td>{username}</td>
			<td>{sname}</td>
			<td>{state}</td>
			<td>
				<ConfigUser {...props} {...{ handleShow }} />
				<EditModal {...props} {...{ handleClose, show }} />
			</td>
		</tr>
	)
}

export const UserTable = (props) => {
	const { data: users } = useGet('/api/admin/user')

	return (
		<CustomTable ready={!!users} align='left'>
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
				{users?.map((task, index) => (
					<UserTr key={index} {...task} />
				))}
			</tbody>
		</CustomTable>
	)
}
