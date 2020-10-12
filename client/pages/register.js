import { useState } from 'react'

import { Card, Form } from 'react-bootstrap'
import CustomAlert from '../components/CustomAlert'
import { CenteredContainer } from '../components/PageLayout'
import OrangeButton from '../components/OrangeButton'
import ShadowCard from '../components/ShadowCard'

import router from 'next/router'
import { useInput, useFocus, useAlert } from '../utils'
import { usePost } from '../utils/api'

const Register = () => {
  const [username, inputUsername] = useInput()
  const [password, inputPassword] = useInput()
  const [sname, inputSname] = useInput()

  const [isLoading, setLoading] = useState(false)
  const [alert, setAlert] = useAlert()

  const post = usePost('/api/register')
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    alert.handleClose()
    try {
      const body = JSON.stringify({ username, password, sname })
      const res = await post(body)
      if (res.ok) {
        router.push('/login')
      } else if (res.status === 403) {
        setAlert({
          head: 'Registration failed !',
          desc: 'Username นี้ถูกใช้ไปแล้ว',
        })
      } else {
        setAlert({ head: res.status, desc: res.statusText })
      }
    } catch (error) {
      setAlert({ head: error.name, desc: error.message })
    } finally {
      setLoading(false)
    }
  }

  const autoFocus = useFocus()

  return (
    <CenteredContainer>
      <CustomAlert {...alert} />
      <ShadowCard>
        <Card.Header>
          <div className='text-center font-weight-bold'>
            OTOG - One Tambon One Grader
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type='username'
                name='username'
                placeholder='Username'
                required
                {...autoFocus}
                {...inputUsername}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type='password'
                name='password'
                placeholder='Password'
                required
                {...inputPassword}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type='sname'
                name='sname'
                placeholder='Display name'
                required
                {...inputSname}
              />
            </Form.Group>
            <OrangeButton disabled={isLoading} type='submit' block>
              {isLoading ? 'Loading...' : 'Create User'}
            </OrangeButton>
          </Form>
          <hr />
          <OrangeButton variant='outline-secondary' href='/login' block>
            {`< Back`}
          </OrangeButton>
        </Card.Body>
      </ShadowCard>
    </CenteredContainer>
  )
}

export default Register
