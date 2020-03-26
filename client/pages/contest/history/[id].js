import { Container } from 'react-bootstrap'

import Title from '../../../components/Title'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import OrangeButton from '../../../components/OrangeButton'
import { CustomTable, CustomTr } from '../../../components/CustomTable'

import { faChartArea } from '@fortawesome/free-solid-svg-icons'

const ScoreTr = props => {
	const { id, username, timeUsed } = props
	const scores = []
	const sum = arr => arr.reduce((a, b) => a + b, 0)

	return (
		<CustomTr>
			<td>{id}</td>
			<td>{username}</td>
			{scores.map((score, index) => (
				<td key={index}>{score}</td>
			))}
			<td>{sum(scores)}</td>
			<td>{timeUsed}</td>
		</CustomTr>
	)
}

const Scoreboard = () => {
	const { countProblem, contestants } = { countProblem: 3, contestants: [] }
	return (
		<CustomTable>
			<thead>
				<tr>
					<th>#</th>
					<th>ชื่อผู้เข้าแข่งขัน</th>
					{[...Array(countProblem)].map((n, i) => (
						<th key={i}>ข้อที่ {i + 1}</th>
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
	return (
		<>
			<Header />
			<Container>
				<Title icon={faChartArea} noBot='true' title='Contest Ranking'>
					<OrangeButton href='/contest/history'>View Contest</OrangeButton>
				</Title>
				<hr />
				<Scoreboard />
				<Footer />
			</Container>
		</>
	)
}

export default ContestScoreboard
