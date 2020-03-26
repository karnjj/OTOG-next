import { useEffect, useState } from 'react'
import { useAuthContext } from '../../../utils/auth'
import { Container, Row, Col } from 'react-bootstrap'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import OrangeButton from '../../../components/OrangeButton'
import { CustomTable, CustomTr } from '../../../components/CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartArea } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

const ScoreTr = props => {
	const { id, sname, timeUsed, sum ,prob } = props
	return (
		<CustomTr>
			<td>{id}</td>
			<td>{sname}</td>
			{prob.map((score, index) => (
				<td key={index}>{score.score}</td>
			))}
			<td>{sum}</td>
			<td>{timeUsed}</td>
		</CustomTr>
	)
}

const Scoreboard = props => {
	const { countProblem, contestants } = props
	return (
		<CustomTable>
			<thead>
				<tr>
					<th>#</th>
					<th>ชื่อผู้เข้าแข่งขัน</th>
					{[...Array(countProblem).keys()].map(n => (
						<th>ข้อที่ {n + 1}</th>
					))}
					<th>คะแนนรวม</th>
					<th>เวลารวม</th>
				</tr>
			</thead>
			<tbody>
				{contestants.map((con, index) => (
					<ScoreTr key={index} {...con} />
				))}
			</tbody>
		</CustomTable>
	)
}

const ContestScoreboard = props => {
	const router = useRouter()
	const { id } = router.query
	const userData = useAuthContext()
	const [taskState, setTaskState] = useState([])
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest/history/${id}`
			const response = await fetch(url, {
				headers: {
					authorization: userData ? userData.id : ''
				}
			})
			const json = await response.json()
			setTaskState(json)
		}
		fetchData()
	}, [])
	return (
		<>
			<Header />
			<Container>
				<br />
				<br />
				<br />
				<Row>
					<Col>
						<h2>
							<FontAwesomeIcon icon={faChartArea} /> Contest Ranking
						</h2>
					</Col>
					<Col xs='auto'>
						<OrangeButton href='/contest/history'>View Contest</OrangeButton>
					</Col>
				</Row>
				<hr />
				<Scoreboard contestants={taskState} countProblem={3} />
				<Footer />
			</Container>
		</>
	)
}

export default ContestScoreboard
