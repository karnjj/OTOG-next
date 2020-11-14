import { memo, useState, useCallback, useEffect } from 'react'
import { ButtonGroup, Button, Modal, Form } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencilAlt,
  faTrash,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { useGet, usePost, useDelete } from '../utils/api'
import { useShow, useForm } from '../utils'
import { RenderOnIntersect } from './RenderOnIntersect'
import { CustomTable } from './CustomTable'
import { mutate } from 'swr'

const defaultUser = { username: '', password: '', sname: '' }

export const NewUser = () => {
  const [show, handleShow, handleClose] = useShow(false)
  const { data, onValueChange, setData } = useForm(defaultUser)
  const { username, password, sname } = data

  const post = usePost('/api/admin/user')
  const onSubmit = async (event) => {
    event.preventDefault()
    const body = JSON.stringify(data)
    const response = await post(body)
    if (response.ok) {
      handleClose()
      mutate('/api/admin/user')
      setData(defaultUser)
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
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Username :</Form.Label>
              <Form.Control
                name='username'
                value={username}
                onChange={onValueChange}
                placeholder='Username'
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password :</Form.Label>
              <Form.Control
                name='password'
                type='password'
                value={password}
                placeholder='Password'
                onChange={onValueChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Display Name :</Form.Label>
              <Form.Control
                name='sname'
                value={sname}
                onChange={onValueChange}
                placeholder='Display Name'
                required
              />
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
  const { data, onValueChange, setData } = useForm({})
  const { username, sname, state, password } = data

  useEffect(() => {
    const { username = '', sname = '', state = '' } = user
    setData({ username, password: '', sname, state })
  }, [user])

  const { idUser } = user
  const post = usePost(`/api/admin/user/${idUser}`)

  const onSave = async (event) => {
    event.preventDefault()
    const body = JSON.stringify(data)
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
        <Form onSubmit={onSave}>
          <Form.Group>
            <Form.Label>Username : </Form.Label>
            <Form.Control
              name='username'
              value={username}
              onChange={onValueChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Display Name : </Form.Label>
            <Form.Control name='sname' value={sname} onChange={onValueChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>User Level : </Form.Label>
            <Form.Control
              name='state'
              type='number'
              value={state}
              onChange={onValueChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New Password : </Form.Label>
            <Form.Control
              name='password'
              type='password'
              value={password}
              placeholder='New Password'
              onChange={onValueChange}
            />
          </Form.Group>
          <hr />
          <Button variant='success' type='submit' block>
            Save
          </Button>
        </Form>
      </Modal.Body>
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
