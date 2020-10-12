import { useState } from 'react'

import { Card, Form } from 'react-bootstrap'
import CustomAlert from '../components/CustomAlert'
import { CenteredContainer } from '../components/PageLayout'
import OrangeButton from '../components/OrangeButton'
import ShadowCard from '../components/ShadowCard'

import { useInput, useFocus, useAlert } from '../utils'
import { usePost } from '../utils/api'
import { useAuthContext } from '../utils/auth'

const Login = () => {
  const { login } = useAuthContext()
  const [username, inputUsername] = useInput()
  const [password, inputPassword] = useInput()
  const [isLoading, setLoading] = useState(false)
  const [alert, setAlert] = useAlert()

  const post = usePost('/api/login')
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    alert.handleClose()
    try {
      const body = JSON.stringify({ username, password })
      const res = await post(body)
      if (res.ok) {
        const token = await res.json()
        login(token)
      } else if (res.status === 401) {
        setAlert({
          head: 'Login failed !',
          desc: 'Username หรือ Password ไม่ถูกต้อง',
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

  // Edge somtimes doesn't focus on first render
  const autoFocus = useFocus()

  return (
    <CenteredContainer>
      <CustomAlert {...alert} />
      <ShadowCard>
        <Card.Header className='text-center font-weight-bold'>
          OTOG - One Tambon One Grader
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
            <OrangeButton disabled={isLoading} type='submit' block>
              {isLoading ? 'Loading...' : 'Login'}
            </OrangeButton>
          </Form>
          <hr />
          <OrangeButton variant='secondary' href='/register' block>
            Register
          </OrangeButton>
        </Card.Body>
      </ShadowCard>
    </CenteredContainer>
  )
}

export default Login
