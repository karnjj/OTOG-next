import { Card, Form, Alert } from 'react-bootstrap'
import { CenteredContainer } from '../components/PageLayout'
import OrangeButton from '../components/OrangeButton'
import ShadowCard from '../components/ShadowCard'

import { useInput, useShow } from '../utils'
import { usePost } from '../utils/api'
import { useAuthContext } from '../utils/auth'

const Login = () => {
	const { login } = useAuthContext()
	const [username, inputUsername] = useInput()
	const [password, inputPassword] = useInput()
	const [error, showAlert, closeAlert] = useShow(false)
	const post = usePost('/api/login')

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			const body = JSON.stringify({ username, password })
			const response = await post(body)
			if (response.ok) {
				const token = await response.json()
				login(token)
			} else {
				console.log('Login failed.')
				const error = new Error(response.statusText)
				console.log(error)
				showAlert()
			}
		} catch (error) {
			console.error(
				'You have an error in your code or there are Network issues.',
				error
			)
			throw new Error(error)
		}
	}

	return (
		<CenteredContainer>
			<ShadowCard>
				<Card.Header className='text-center font-weight-bold'>
					OTOG - One Tambon One Grader
				</Card.Header>
				<Card.Body>
					{error && (
						<Alert variant='danger' dismissible onClose={closeAlert}>
							<strong>Login Failed !</strong>
							<br />
							Username หรือ Password
							<br />
							ไม่ถูกต้อง
						</Alert>
					)}
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Control
								type='username'
								name='username'
								placeholder='Username'
								required
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
						<OrangeButton type='submit' block>
							Login
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
