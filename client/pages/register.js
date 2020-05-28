import { useState } from 'react'
import fetch from 'isomorphic-unfetch'

import { Container, Col, Row, Card, Form, Alert } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'

import styled from 'styled-components'
import router from 'next/router'

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
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [sname, setSname] = useState('')
	const [error, setError] = useState(false)
	const handleChangeUser = (event) => {
		setUsername(event.target.value)
	}
	const handleChangePass = (event) => {
		setPassword(event.target.value)
	}
	const handleChangeSname = (event) => {
		setSname(event.target.value)
	}
	const handleSubmit = async (event) => {
		event.preventDefault()
		const url = `${process.env.API_URL}/api/register`
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password, sname }),
			})
			if (response.ok) {
				router.push('/login')
			} else {
				console.log('Register failed.')
				let error = new Error(response.statusText)
				console.log(error)
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
		<StyledCard>
			<Card.Header>
				<div className='text-center font-weight-bold'>
					OTOG - One Tambon One Grader
				</div>
			</Card.Header>
			<Card.Body>
				{error && (
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
					<Form.Control
						type='sname'
						name='sname'
						value={sname}
						onChange={handleChangeSname}
						placeholder='Display name'
						required
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
