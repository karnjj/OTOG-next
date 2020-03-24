import { useEffect, useState } from 'react'
import { withAuthSync } from '../../utils/auth'

import { Container } from 'react-bootstrap'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { CustomTable, CustomTr } from '../../components/CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faChartArea } from '@fortawesome/free-solid-svg-icons'

import fetch from 'isomorphic-unfetch'
import OrangeButton from '../../components/OrangeButton'

const ContestTr = props => {
	const { idContest, name, time_start, time_end, mode_grader, judge } = props
	const start = new Date(Number(time_start * 1000))
	const difftime = timestamp => {
		timestamp = Math.floor(timestamp / 60)
		var int_hours = Math.floor(timestamp / 60)
		var hours = int_hours.toString()
		var minutes = (timestamp % 60).toString()
		if (hours.length == 1) hours = '0' + hours
		if (minutes.length == 1) minutes = '0' + minutes
		if (int_hours > 23) return Math.floor(int_hours / 24).toString() + ' days'
		else return hours + ':' + minutes
	}
	return (
		<CustomTr>
			<td>{idContest}</td>
			<td>{name}</td>
			<td>{start.toLocaleDateString('th-TH')}</td>
			<td>{difftime(time_end - time_start)}</td>
			<td>{`${mode_grader} (${judge})`}</td>
			<td>
				<OrangeButton
					expand={4}
					outline='true'
					href='/contest/[id]'
					dynamic={`/contest/${idContest}`}
				>
					<FontAwesomeIcon icon={faChartArea} />
				</OrangeButton>
			</td>
		</CustomTr>
	)
}

const ContestTable = () => {
	const [contests, setContests] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest`
			const response = await fetch(url)
			const data = await response.json()
			setContests(data)
		}
		fetchData()
	}, [])
	return (
		<CustomTable>
			<thead>
				<tr>
					<th>#</th>
					<th>Contest Name</th>
					<th>Start</th>
					<th>Length</th>
					<th>Mode</th>
					<th>Scoreboard</th>
				</tr>
			</thead>
			<tbody>
				{contests.map((con, index) => (
					<ContestTr key={index} {...con} />
				))}
			</tbody>
		</CustomTable>
	)
}

const History = () => {
	return (
		<>
			<Header />
			<Container>
				<br />
				<br />
				<br />
				<h2>
					<FontAwesomeIcon icon={faTrophy} /> Contest History{' '}
				</h2>
				<br />
				<hr />
				<ContestTable />
				<Footer />
			</Container>
		</>
	)
}
export default withAuthSync(History)
