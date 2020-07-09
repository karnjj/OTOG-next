import { login } from '../utils/auth'

import { Container, Card, Form, Alert } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'

import styled from 'styled-components'
import { useInput, useSwitch } from '../utils'
import { usePost } from '../utils/api'

const CenteredContainer = styled(Container)`
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`
const StyledCard = styled(Card)`
	min-width: 325px;
`

const LoginCard = () => {
	const [username, inputUsername] = useInput()
	const [password, inputPassword] = useInput()
	const [error, showAlert, closeAlert] = useSwitch(false)
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
		<StyledCard>
			<Card.Header>
				<div className='text-center font-weight-bold'>
					OTOG - One Tambon One Grader
				</div>
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
					<Form.Control
						type='username'
						name='username'
						placeholder='Username'
						required
						{...inputUsername}
					/>
					<br />
					<Form.Control
						type='password'
						name='password'
						placeholder='Password'
						required
						{...inputPassword}
					/>
					<br />
					<br />
					<OrangeButton size='lg' type='submit' block>
						Sign in
					</OrangeButton>
					<OrangeButton size='lg' href='/register' block>
						Register
					</OrangeButton>
				</Form>
			</Card.Body>
		</StyledCard>
	)
}

const Login = () => (
	<CenteredContainer>
		<LoginCard />
	</CenteredContainer>
)

export default Login
