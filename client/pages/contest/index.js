import { useState, useEffect } from 'react'
import { withAuthSync, useAuthContext, isAdmin } from '../../utils/auth'

import { Container, Row, Jumbotron, Col } from 'react-bootstrap'

import { faTrophy } from '@fortawesome/free-solid-svg-icons'

import { Title } from '../../components/CustomText'
import PageLayout from '../../components/PageLayout'
import TaskCard from '../../components/TaskCard'
import Timer from '../../components/Timer'
import { Loader } from '../../components/Loader'
import OrangeButton from '../../components/OrangeButton'
import Announce from '../../components/Announce'

import styled, { keyframes } from 'styled-components'
import vars from '../../styles/vars'

const popin = keyframes`
	0% {
		opacity: 0;
		transform: scale(0);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
`
const popout = keyframes`
	0% {
		transform: translateY(0);
	}
	100% {
		opacity: 0;
		transform: translateY(-50px);
	}
`

const CenteredDiv = styled.div`
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
const StyledJumbotron = styled(Jumbotron)`
	background: ${vars.grey};
	min-height: 40vh;
	display: flex;
	align-items: center;
`

const Countdown = ({ timeleft, name, idContest }) => (
	<CenteredDiv>
		<h1>
			การแข่งขัน <Announce {...{ idContest }}>{name}</Announce> กำลังจะเริ่ม
		</h1>
		<h3>
			ในอีก <Timer timeLeft={timeleft} mode='th' />
			...
		</h3>
	</CenteredDiv>
)

const EndingContest = ({ idContest }) => {
	return (
		<CenteredDiv>
			<h1>การแข่งขันจบแล้ว</h1>
			<OrangeButton
				href='/contest/history/[id]'
				dynamic={`/contest/history/${idContest}`}
				size='lg'
			>
				สรุปผลการแข่งขัน
			</OrangeButton>
		</CenteredDiv>
	)
}
const NoContest = (props) => {
	const userData = useAuthContext()
	return (
		<CenteredDiv>
			<h1>ยังไม่มีการแข่งขัน</h1>
			<OrangeButton href='/contest/history' className='mr-2'>
				See Contest History
			</OrangeButton>
			{isAdmin(userData) && (
				<OrangeButton href='/contest/submission'>See Submission</OrangeButton>
			)}
		</CenteredDiv>
	)
}

const NoLogin = (props) => {
	return (
		<CenteredDiv>
			<h1>กรุณาเข้าสู่ระบบเพื่อแข่งขัน</h1>
		</CenteredDiv>
	)
}

const HoldingContest = ({ idContest, timeleft, name }) => {
	const [tasks, setTasks] = useState(null)
	const userData = useAuthContext()

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest/${idContest}`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			if (json.problem != undefined) setTasks(json.problem)
		}
		fetchData()
	}, [])

	return (
		<Container>
			<Title icon={faTrophy} text={name} paddingTop={false}>
				<h2>
					<Timer timeLeft={timeleft} />
				</h2>
			</Title>
			<hr />
			{tasks?.map((task, index) => (
				<TaskCard
					key={index}
					idContest={idContest}
					index={index + 1}
					{...task}
				/>
			)) ?? <Loader />}
			{isAdmin(userData) && (
				<Row>
					<Col className='d-flex justify-content-end'>
						<OrangeButton
							outline='true'
							href='/contest/submission'
							className='mr-3'
						>
							See Submission
						</OrangeButton>
						<OrangeButton
							outline='true'
							href='/contest/history/[id]'
							dynamic={`/contest/history/[${idContest}]`}
						>
							Live Scoreboard
						</OrangeButton>
					</Col>
				</Row>
			)}
		</Container>
	)
}

const Contest = ({ contest, serverTime }) => {
	const userData = useAuthContext()
	var start,
		now,
		end,
		idContest,
		isAboutToStart,
		isHolding,
		isJustEnd = null
	if (contest) {
		start = contest.time_start
		now = Math.floor(serverTime / 1000)
		end = contest.time_end
		idContest = contest.idContest
		isAboutToStart = now < start
		isHolding = start <= now && now <= end
		isJustEnd = now - end < 60 * 60
	}

	return (
		<PageLayout container={false} fluid className='justify-content-center'>
			<StyledJumbotron>
				<Container fluid>
					<Row className='d-flex justify-content-center'>
						<Col xs={12} lg={isHolding ? 10 : 12} xl={isHolding ? 8 : 12}>
							{!userData ? (
								<NoLogin />
							) : isAboutToStart ? (
								<Countdown
									timeleft={start - now}
									idContest={idContest}
									name={contest.name}
								/>
							) : isHolding ? (
								<HoldingContest
									timeleft={end - now}
									idContest={idContest}
									name={contest.name}
								/>
							) : isJustEnd ? (
								<EndingContest idContest={idContest} />
							) : (
								<NoContest />
							)}
						</Col>
					</Row>
				</Container>
			</StyledJumbotron>
		</PageLayout>
	)
}

Contest.getInitialProps = async (ctx) => {
	const url = `${process.env.API_URL}/api/contest`
	let headers = { 'Content-Type': 'application/json' }
	const res = await fetch(url, { headers })
	const json = await res.json()
	return { contest: json.result[0], serverTime: json.serverTime }
}

export default withAuthSync(Contest)
