import React, { useState, useEffect } from 'react'
import { withAuthSync, useAuthContext } from '../../utils/auth'
import { Container, Col, Row, Card } from 'react-bootstrap'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Graph from '../../components/Graph'
import { Title, ColoredText } from '../../components/CustomText'
import { userClass } from '../../utils/user'
import { useRouter } from 'next/router'

const Rating = () => {
	const [info, setInfo] = useState({})
	const userData = useAuthContext()
	const router = useRouter()
	const { id } = router.query
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/profile/${id}`
			const response = await fetch(url)
			const json = await response.json()
			setInfo(json)
		}
		fetchData()
	}, [])
	return (
		<>
			<Header />
			<Container>
				<Title icon={faUser} text='Profile' />
				<Row>
					<Col lg={8} className='pb-3'>
						<Card bg='light'>
							<Card.Body>
								<Card.Text as='div' className='pl-3 pb-3'>
									<h1>
										<ColoredText rating={info.rating}>{info.sname}</ColoredText>
									</h1>
									<h5>
										<ColoredText rating={info.rating}>
											{userClass(info.rating)}
										</ColoredText>
									</h5>
									<h5>
										Rating :{' '}
										<ColoredText rating={info.rating}>
											{info.rating}
										</ColoredText>{' '}
										(max : <ColoredText rating={0}>-</ColoredText>)
									</h5>
									<h5>Participated Contest : -</h5>
									<h5>Solved Problem : -</h5>
								</Card.Text>
								<Graph />
							</Card.Body>
						</Card>
					</Col>
					<Col lg={4} className='d-flex justify-content-center'>
						<Card bg='light' style={{ maxWidth: '350px' }}>
							<Card.Img
								variant='top'
								src={`${process.env.API_URL}/api/avatar/${id}`}
								alt='Profile Image'
							/>
							<Card.Body>
								<Card.Title>Trophy</Card.Title>
								<Row>
									<Col>
										<p>
											Champion 🏆:
											<br />-
										</p>
									</Col>
									<Col>
										<p>
											Perfect Score 🎯: <br />-
										</p>
									</Col>
								</Row>
								<Row>
									<Col>
										<p>
											First Blood 💀: <br />-
										</p>
									</Col>
									<Col>
										<p>
											One man solve 🥇:
											<br />-
										</p>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Footer />
			</Container>
		</>
	)
}

export default withAuthSync(Rating)
