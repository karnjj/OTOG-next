import { withAuthSync } from '../../utils/auth'
import { userClass } from '../../utils/user'

import { Container, Col, Row, Card } from 'react-bootstrap'
import { Title, ColoredText } from '../../components/CustomText'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Graph from '../../components/Graph'

import styled from 'styled-components'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const CustomCard = styled(Card)`
	height: 100%;
`
const ImageCustomCard = styled(CustomCard)`
	width: 345px;
`
const GraphCard = ({ userInfo }) => (
	<CustomCard bg='light'>
		<Card.Body>
			<Card.Text as='div' className='pl-3 pb-3'>
				<h1>
					<ColoredText {...userInfo}>{userInfo.sname}</ColoredText>
				</h1>
				<h5>
					<ColoredText {...userInfo}>{userClass(userInfo)}</ColoredText>
				</h5>
				<h5>
					Rating : <ColoredText {...userInfo}>{userInfo.rating}</ColoredText>{' '}
					(max : <ColoredText rating={0}>-</ColoredText>)
				</h5>
				<h5>Participated Contest : -</h5>
				<h5>Solved Problem : -</h5>
			</Card.Text>
			<Graph />
		</Card.Body>
	</CustomCard>
)

const ImageCard = ({ userInfo, id }) => (
	<ImageCustomCard bg='light'>
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
	</ImageCustomCard>
)

const Rating = (props) => (
	<>
		<Header />
		<Container>
			<Title icon={faUser} text='Profile' />
			<hr />
			<Row xs={1} lg={2}>
				<Col lg={7} xl={8} className='mb-3 mb-lg-0'>
					<GraphCard {...props} />
				</Col>
				<Col
					lg={5}
					xl={4}
					className='d-flex justify-content-center align-item-center py-3'
				>
					<ImageCard {...props} />
				</Col>
			</Row>
			<Footer />
		</Container>
	</>
)

Rating.getInitialProps = async ({ query }) => {
	const id = query.id
	const url = `${process.env.API_URL}/api/profile/${id}`
	const response = await fetch(url)
	const json = await response.json()
	return { userInfo: json, id }
}

export default withAuthSync(Rating)
