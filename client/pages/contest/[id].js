import { Container, Row, Col } from 'react-bootstrap'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrangeButton from '../../components/OrangeButton'
import { CustomTable, CustomTr } from '../../components/CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
				<Scoreboard />
				<Footer />
			</Container>
		</>
	)
}

export default ContestScoreboard
