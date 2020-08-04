import { Container, Col, Row, Card, Form, Alert } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'

import styled from 'styled-components'
import router from 'next/router'
import { useInput, useShow } from '../utils'
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
const RegisterCard = () => {
	const [username, inputUsername] = useInput()
	const [password, inputPassword] = useInput()
	const [sname, inputSname] = useInput()
	const [show, showAlert, closeAlert] = useShow(false)

	const post = usePost('/api/register')

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			const body = JSON.stringify({ username, password, sname })
			const response = await post(body)

			if (response.ok) {
				router.push('/login')
			} else {
				console.log('Register failed.')
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
				{show && (
					<Alert variant='danger' dismissible onClose={closeAlert}>
						<strong>Register Failed !</strong>
						<br />
						Username นี้ถูกใช้ไปแล้ว
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
					<Form.Control
						type='sname'
						name='sname'
						placeholder='Display name'
						required
						{...inputSname}
					/>
					<br />
					<br />
					<OrangeButton size='lg' type='submit' block>
						Create User
					</OrangeButton>
					<OrangeButton size='lg' href='/login' block>
						{`< Back`}
					</OrangeButton>
				</Form>
			</Card.Body>
		</StyledCard>
	)
}

const Register = () => (
	<CenteredContainer>
		<RegisterCard />
	</CenteredContainer>
)

export default Register
