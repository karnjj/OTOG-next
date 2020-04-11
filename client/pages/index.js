import { useState, useEffect } from 'react'
import { withAuthSync, useAuthContext } from '../utils/auth'
import fetch from 'isomorphic-unfetch'

import { Jumbotron, Container, Row, Col } from 'react-bootstrap'
import Title from '../components/Title'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProbTable from '../components/ProbTable'
import OrangeButton from '../components/OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faQuestion,
	faFlagCheckered,
	faTrophy,
	faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons'

import styled, { css, keyframes } from 'styled-components'
import vars from '../styles/vars'

import CountUp from 'react-countup'
import { lighten } from 'polished'
import { down } from 'styled-breakpoints'

const WelcomeText = styled.h4`
	color: ${vars.black};
	text-align: center;
`
const AliveText = styled.h6`
	color: ${vars.black};
	text-align: center;
	font-weight: bold;
`
const Number = styled(CountUp)`
	color: ${vars.white};
	font-family: Calibri;
	font-size: 50px;
	margin-top: -5px;
	font-weight: 100;
	text-align: center;
`
const Message = styled.h5`
	color: ${vars.white};
	font-family: Calibri;
	font-size: 15px;
	margin-top: 10px;
	margin-bottom: 0px;
	font-weight: 600;
	text-align: center;
`
const popin = keyframes`
	0% {
		transform: scale(0);
	}
	90% {
		transform: scale(1.05);
	}
	100% {
		transform: scale(1);
	}
`
const CountButton = styled.li`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	user-select: none;
	cursor: pointer;
	background: ${(props) => lighten(0.05, props.color)};
	box-shadow: 0 5px ${vars.btn_gray};
	border-radius: 1rem;
	width: 128px;
	height: 95px;
	padding: 20px;
	margin: 6px 3px;
	transition: background-color 0.1s;
	&:hover {
		background: ${(props) => lighten(0.08, props.color)};
	}
	&:active {
		background: ${(props) => props.color};
		transform: translateY(3px);
		box-shadow: 0 2px ${vars.btn_gray};
	}
	animation: ${popin} 0.25s ease backwards
		${(props) => props.index * 0.01 + 's'};
	animation-play-state: ${(props) => !props.number && 'pause'};
`
const ButtonWrapper = styled.ul`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	list-style: none;
	padding: 0;
`

const Code = styled.code`
	font-weight: bold;
	color: ${(props) => props.color};
`
const StyledWelcome = styled.div`
	${down('xl')} {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
`

const Welcome = () => (
	<StyledWelcome>
		<h1>
			Welcome to
			<Code color={vars.green}> O</Code>
			<Code color={vars.red}> T</Code>
			<Code color={vars.orange}> O</Code>
			<Code color={vars.blue}> G</Code>
		</h1>
		<h1>Become a god of competitive programming.</h1>
		<h3>Learn how to code and build algorithms efficiently.</h3>
		<br />
		<OrangeButton size='lg' href='register' target='_blank'>
			Sign Up
		</OrangeButton>
	</StyledWelcome>
)

const Hello = () => {
	const userData = useAuthContext()
	const [data, setData] = useState({})

	useEffect(() => {
		const fetchData = async () => {
			let url = `${process.env.API_URL}/api/countProblem`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData.id
			const response = await fetch(url, { headers })
			const probData = await response.json()
			const { allProblem, userProblem, onlineUser } = probData
			const { passProb, wrongProb } = userProblem
			setData({
				allProblem,
				onlineUser,
				passProb,
				wrongProb,
				noSub: allProblem - passProb - wrongProb,
				newProb: 0,
				onlineUser,
			})
		}
		fetchData()
	}, [])
	return (
		<>
			<WelcomeText>สวัสดี {userData.sname}</WelcomeText>
			<ButtonWrapper>
				{[
					//message,  number,     color
					['ทั้งหมด', data.allProblem, vars.btn_black],
					['ผ่านแล้ว', data.passProb, vars.btn_green],
					['ยังไม่ผ่าน', data.wrongProb, vars.btn_red],
					['ยังไม่ส่ง', data.noSub, vars.btn_orng],
					['โจทย์วันนี้', data.newProb, vars.btn_blue],
				].map(([message, number, color], index) => (
					<CountButton {...{ number, color, index }} key={index}>
						<Message>{message}</Message>
						<Number end={number ? number : 0} />
					</CountButton>
				))}
			</ButtonWrapper>
			<AliveText>
				ยังมีชีวิตรอด : <CountUp end={data.onlineUser ? data.onlineUser : 0} />
			</AliveText>
		</>
	)
}

const ProblemTable = () => {
	const userData = useAuthContext()
	const [taskState, setTaskState] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/problem?mode=firstpage`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setTaskState(json)
		}
		fetchData()
	}, [])
	return <ProbTable problems={taskState} />
}

const Index = () => {
	const userData = useAuthContext()

	return (
		<>
			<Header />
			<Jumbotron>
				<Container>{userData ? <Hello /> : <Welcome />}</Container>
			</Jumbotron>
			<Container>
				<Row>
					<Col md={4} className='px-5 p-md-3'>
						<h2>
							<FontAwesomeIcon icon={faQuestion} /> FAQ
						</h2>
						<p>
							ไม่รู้ว่าจะเริ่มต้นอย่างไร ทุกอย่างดูงงไปหมด
							ถ้าหากคุณมีปัญหาเหล่านี้สามารถ หาคำตอบได้จาก
							คำถามยอดนิยมที่ผู้ใช้ส่วนใหญ่มักจะถามเป็นประจำ
						</p>
						<OrangeButton size='lg' href='#'>
							Learn More
						</OrangeButton>
						<br />
						<br />
					</Col>
					<Col md={4} className='px-5 p-md-3'>
						<h2>
							<FontAwesomeIcon icon={faFlagCheckered} /> Get started
						</h2>
						<p>
							เพิ่งเริ่มการเดินทาง อาจจะอยากได้การต้อนรับที่ดี
							ด้วยโจทย์ที่คัดสรรว่าเหมาะสำหรับผู้เริ่มต้นใน competitive
							programming
						</p>
						<OrangeButton size='lg' href='problem'>
							View Problem
						</OrangeButton>
						<br />
						<br />
					</Col>
					<Col md={4} className='px-5 p-md-3'>
						<h2>
							<FontAwesomeIcon icon={faTrophy} /> Contest
						</h2>
						<p>
							ทำโจทย์คนเดียวมันอาจจะเหงา ลองมาเข้า contest
							การแข่งขันอันทรงเกียรติ (?)
							เพื่อจะได้มีเพื่อนทำโจทย์และแข่งขันไปพร้อม ๆ กันกับเรา
						</p>
						<OrangeButton size='lg' href='contest'>
							Join Contest
						</OrangeButton>
						<br />
						<br />
					</Col>
				</Row>
				<div>
					<i className='glyphicon glyphicon-asterisk'></i>
					<Title icon={faPuzzlePiece} title='โจทย์ใหม่' noBot='true' />
				</div>
				<hr />
				<ProblemTable />
				<Footer />
			</Container>
		</>
	)
}
export default withAuthSync(Index)
