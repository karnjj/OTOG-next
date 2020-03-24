import { useState } from 'react'
import { withAuthSync } from '../../utils/auth'

import { Container, Row, Jumbotron } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrangeButton from '../../components/OrangeButton'

import styled from 'styled-components'

const Announce = styled(Container)`
	text-align: center;
	padding: 50px 0;
`
const StyledTimer = styled(Jumbotron)`
	text-align: center;
	h1 {
		font-size: 300%;
		font-weight: 900;
		margin: 0 0 25px;
	}
	h3 {
		font-weight: bold;
	}
`
const Timer = props => {
	const { time, end } = props

	return (
		<StyledTimer>
			{time ? (
				<>
					<h1>การแข่งขันกำลังจะเริ่ม</h1>
					<h3>ในอีก 20 วินาที...</h3>
				</>
			) : end ? (
				<>
					<h1>การแข่งขันจบแล้ว</h1>
					<OrangeButton>สรุปผลการแข่งขัน</OrangeButton>
				</>
			) : (
				<>
					<h1>ยังไม่มีการแข่งขัน</h1>
					<OrangeButton href='/contest/history' className='ml-auto'>
						See Contest History
					</OrangeButton>
				</>
			)}
		</StyledTimer>
	)
}

const Contest = () => {
	const [isHolding, setIsHolding] = useState(false)
	const [isEnd, setIsEnd] = useState(false)

	return (
		<>
			<Header />
			<Container>
				<br />
				<Announce>
					<h2>Announcement from Admin</h2>
				</Announce>
			</Container>
			<Timer time={isHolding} end={isEnd} />
			<Container>
				{isHolding ? (
					<Row>
						<OrangeButton outline href='/contest/history' className='ml-auto'>
							See History
						</OrangeButton>
					</Row>
				) : (
					<br />
				)}
				<br />
				<br />
				<br />
				<Footer />
			</Container>
		</>
	)
}
export default withAuthSync(Contest)
