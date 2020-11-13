import { memo, useState, useCallback, useEffect } from 'react'
import { ButtonGroup, Button, Modal, Form } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencilAlt,
  faTrash,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { useGet, usePost, useHttp, useDelete } from '../utils/api'
import { useShow, useInput } from '../utils'
import { RenderOnIntersect } from './RenderOnIntersect'
import { CustomTable } from './CustomTable'
import { mutate } from 'swr'

export const NewUser = () => {
  const [show, handleShow, handleClose] = useShow(false)
  const [username, inputUsername] = useInput()
  const [password, inputPassword] = useInput()
  const [sname, inputSname] = useInput()
  const post = usePost('/api/admin/user')

  const onSubmit = async (event) => {
    event.preventDefault()
    const body = JSON.stringify({ username, password, sname })
    const response = await post(body)
    if (response.ok) {
      handleClose()
      mutate('/api/admin/user')
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
  const del = useDelete(`/api/admin/user/${idUser}`)

  const handleDelete = async () => {
    if (confirm(`Delete user id : ${idUser}`)) {
      const response = await del()
      if (response.ok) {
        mutate('/api/admin/user')
      }
    }
  }

  return (
    <ButtonGroup>
      <Button title='Edit' variant='info' onClick={handleShow}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </Button>
      <Button title='Delete' variant='danger' onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </ButtonGroup>
  )
}

const EditModal = (props) => {
  const { show, handleClose, user } = props
  const { idUser } = user

  const [username, inputUsername, setUsername] = useInput(user.username)
  const [password, inputPassword, setPassword] = useInput('')
  const [sname, inputSname, setSname] = useInput(user.sname)
  const [state, inputState, setState] = useInput(user.state, (val) =>
    Number(val)
  )

  useEffect(() => {
    setUsername(user.username)
    setPassword('')
    setSname(user.sname)
    setState(user.state)
  }, [user])

  const post = usePost(`/api/admin/user/${idUser}`)

  const onSave = async (event) => {
    event.preventDefault()
    const body = JSON.stringify({ username, sname, state, password })
    const response = await post(body)
    if (response.ok) {
      handleClose()
      mutate('/api/admin/user')
    }
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
          <Form.Control
            type='password'
            placeholder='New Password'
            {...inputPassword}
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

const UserRow = memo((props) => {
  const { user, selectUser } = props
  const { idUser, username, sname, state } = user
  const handleShow = useCallback(() => {
    selectUser(user)
  }, [user])

  return (
    <RenderOnIntersect id={`admin/users/${sname}`} initialHeight='63px' as='tr'>
      <tr onDoubleClick={handleShow}>
        <td>{idUser}</td>
        <td>{username}</td>
        <td>{sname}</td>
        <td>{state}</td>
        <td>
          <ConfigUser handleShow={handleShow} idUser={idUser} />
        </td>
      </tr>
    </RenderOnIntersect>
  )
})

export const UserTable = () => {
  const {
    data: { users },
    isLoading,
  } = useGet('/api/admin/user')

  const [userModal, setUserModal] = useState({ show: false, user: {} })
  const selectUser = useCallback((user) => {
    setUserModal({ user, show: true })
  }, [])
  const handleClose = useCallback(() => {
    setUserModal((prevState) => ({ ...prevState, show: false }))
  }, [])

  return (
    <>
      <CustomTable isLoading={isLoading} align='left'>
        <thead className='thead-light'>
          <RenderOnIntersect id='admin/users/head' initialHeight='50px' as='tr'>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Display Name</th>
              <th>Level</th>
              <th>Config</th>
            </tr>
          </RenderOnIntersect>
        </thead>
        <tbody>
          {users?.map((user) => (
            <UserRow key={user.idUser} user={user} selectUser={selectUser} />
          ))}
        </tbody>
      </CustomTable>

      <EditModal {...userModal} handleClose={handleClose} />
    </>
  )
}
