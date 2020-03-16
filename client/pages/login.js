import { useState } from 'react';
import fetch from 'isomorphic-unfetch'
import { login } from '../utils/auth'

import { Container, Col, Row, Card, Form, Alert } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'

import styled from 'styled-components'

const LoginCard = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const handleChangeUser = (event) => {
        setUsername(event.target.value)
    }
    const handleChangePass = (event) => {
        setPassword(event.target.value)
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        const url = `${process.env.API_URL}/api/login`
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            if (response.ok) {
                const token = await response.json()
                login(token)
            } else {
                console.log('Login failed.')
                let error = new Error(response.statusText)
                console.log(error);
                setError(true)
            }
        } catch (error) {
            console.error(
                'You have an error in your code or there are Network issues.',
                error
            )
            throw new Error(error)
        }
    }
    const closeAlert = () => {
        setError(false)
    }

    return (
        <Card>
            <Card.Header>
                <div className="text-center font-weight-bold"> OTOG - One Tambon One Grader </div>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant='danger' dismissible onClose={closeAlert}>
                    <strong>Login Failed !</strong>
                    <br />
                    Username หรือ Password
                    <br />
                    ไม่ถูกต้อง
                </Alert>
                }
                <Form onSubmit={handleSubmit}>
                    <Form.Control
                        type='username'
                        name='username'
                        value={username}
                        onChange={handleChangeUser}
                        placeholder='Username'
                        required
                    />
                    <br />
                    <Form.Control
                        type='password'
                        name='password'
                        value={password}
                        onChange={handleChangePass}
                        placeholder='Password'
                        required
                    />
                    <br />
                    <br />
                    <OrangeButton size='lg' type='submit' block>Sign in</OrangeButton>
                    <OrangeButton size='lg' href='/register' block>Register</OrangeButton>
                </Form>
            </Card.Body>
        </Card>
    )
}

const PaddedForm = styled(Container)`
    padding: 100px 0;
`

const Login = () => (
    <PaddedForm>
        <Row>
            <Col xs={1} md={3} lg={4}/>
            <Col xs={10}md={6} lg={4}><LoginCard/></Col>
            <Col xs={1} md={3} lg={4}/>
        </Row>
    </PaddedForm>
)

export default Login