import { useEffect, useState } from 'react'
import { useAuthContext } from '../../../utils/auth'
import { Container, Row, Col } from 'react-bootstrap'

import Title from '../../../components/Title'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import OrangeButton from '../../../components/OrangeButton'
import { CustomTable, CustomTr } from '../../../components/CustomTable'

import { faChartArea } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

const ScoreTr = props => {
	const { id, sname, timeUsed, sum, scores , problem} = props
	return (
		<CustomTr>
			<td>{id}</td>
			<td>{sname}</td>
			{problem.map((prob, index) => (
				<td key={index}>{(scores[prob.id_Prob]) ? 
					scores[prob.id_Prob].score : 
					0}</td>
			))}
			<td>{sum}</td>
			<td>{timeUsed}</td>
		</CustomTr>
	)
}

const Scoreboard = props => {
	const { Problem, contestants } = props
	return (
		<CustomTable>
			<thead>
				<tr>
					<th>#</th>
					<th>ชื่อผู้เข้าแข่งขัน</th>
					{Problem.map((n, i) => (
						<th key={i}>ข้อที่ {i + 1}</th>
					))}
					<th>คะแนนรวม</th>
					<th>เวลารวม</th>
				</tr>
			</thead>
			<tbody>
				{contestants.map((con, index) => (
					<ScoreTr key={index} problem={Problem} {...con} />
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
	const [contestProb, setContestProb] = useState([])
	useEffect(() => {
		const fetchData = async () => {
			const url1 = `${process.env.API_URL}/api/contest/history/${id}`
			const url2 = `${process.env.API_URL}/api/contest/${id}`
			const response1 = await fetch(url1, {
				headers: {
					authorization: userData ? userData.id : ''
				}
			})
			const response2 = await fetch(url2, {
				headers: {
					authorization: userData ? userData.id : ''
				}
			})
			const json1 = await response1.json()
			const json2 = await response2.json()
			setTaskState(json1)
			setContestProb(json2.problem)
		}
		fetchData()
	}, [])
	return (
		<>
			<Header />
			<Container>
				<Title icon={faChartArea} noBot='true' title='Contest Ranking'>
					<OrangeButton href='/contest/history'>View Contest</OrangeButton>
				</Title>
				<hr />
				<Scoreboard contestants={taskState} Problem={contestProb} />
				<Footer />
			</Container>
		</>
	)
}

export default ContestScoreboard
