import { useEffect, useState } from 'react'
import { withAuthSync } from '../../../utils/auth'

import { Title } from '../../../components/CustomText'
import PageLayout from '../../../components/PageLayout'
import { CustomTable, CustomTr } from '../../../components/CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faChartArea } from '@fortawesome/free-solid-svg-icons'

import fetch from 'isomorphic-unfetch'
import OrangeButton from '../../../components/OrangeButton'

const ContestTr = (props) => {
	const { idContest, name, time_start, time_end, mode_grader, judge } = props
	const now = new Date()
	const start = new Date(Number(time_start * 1000))
	const PascalCase = (str) => str[0].toUpperCase() + str.slice(1)
	const difftime = (timestamp) => {
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
			<td>{start.toLocaleString('th-TH')}</td>
			<td>{difftime(time_end - time_start)}</td>
			<td>{`${PascalCase(mode_grader)} (${PascalCase(judge)})`}</td>
			<td>
				{time_end < now.valueOf() && (
					<OrangeButton
						expand={4}
						outline='true'
						href='/contest/history/[id]'
						dynamic={`/contest/history/${idContest}`}
					>
						<FontAwesomeIcon icon={faChartArea} />
					</OrangeButton>
				)}
			</td>
		</CustomTr>
	)
}

const ContestTable = () => {
	const [contests, setContests] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest/history`
			const response = await fetch(url)
			const data = await response.json()
			setContests(data)
		}
		fetchData()
	}, [])
	return (
		<CustomTable ready={contests.length}>
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
		<PageLayout>
			<Title icon={faTrophy} text='Contest History' />
			<hr />
			<ContestTable />
		</PageLayout>
	)
}
export default withAuthSync(History)
