import { Card, Form, Alert } from 'react-bootstrap'
import { CenteredContainer } from '../components/PageLayout'
import OrangeButton from '../components/OrangeButton'
import ShadowCard from '../components/ShadowCard'

import router from 'next/router'
import { useInput, useShow } from '../utils'
import { usePost } from '../utils/api'

const Register = () => {
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
		<CenteredContainer>
			<ShadowCard>
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
						<Form.Group>
							<Form.Control
								type='sname'
								name='sname'
								placeholder='Display name'
								required
								{...inputSname}
							/>
						</Form.Group>
						<OrangeButton type='submit' block>
							Create User
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
