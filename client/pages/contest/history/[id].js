import { useEffect, useState } from 'react'
import {
	withAuthSync,
	useAuthContext,
	useTokenContext,
} from '../../../utils/auth'

import { Title, Name } from '../../../components/CustomText'
import PageLayout from '../../../components/PageLayout'
import OrangeButton from '../../../components/OrangeButton'
import {
	CustomTable,
	CustomTr,
	UserTd,
	CustomTd,
} from '../../../components/CustomTable'

import { faChartArea } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

const ScoreTr = (props) => {
	const { rank, sname, sumTime, sum, scores, problems, rating, idUser } = props
	const maxSum = problems.reduce((total, prob) => total + prob.score, 0)
	const score = (prob) =>
		scores[prob.id_Prob] ? scores[prob.id_Prob].score : 0
	const round = (num) => Math.round(num * 100) / 100

	return (
		<CustomTr acceptState={sum === maxSum}>
			<td>{rank}</td>
			<td>
				<Name {...{ rating, sname, idUser}} />
			</td>
			{problems.map((prob, index) => (
				<CustomTd
					key={index}
					acceptState={prob.score === score(prob)}
					wrongState={scores[prob.id_Prob] && prob.score !== score(prob)}
				>
					{round(score(prob))}
				</CustomTd>
			))}
			<td>{round(sum)}</td>
			<td>{round(sumTime)}</td>
		</CustomTr>
	)
}

const Scoreboard = (props) => {
	const { problems, contestants } = props
	return (
		<CustomTable ready={problems.length}>
			<thead>
				<tr>
					<th>#</th>
					<th>ชื่อผู้เข้าแข่งขัน</th>
					{problems.map((n, i) => (
						<th key={i} title={n.name}>
							ข้อที่ {i + 1}
						</th>
					))}
					<th>คะแนนรวม</th>
					<th>เวลารวม</th>
				</tr>
			</thead>
			<tbody>
				{contestants.map((con, index) => (
					<ScoreTr key={index} problems={problems} {...con} />
				))}
			</tbody>
		</CustomTable>
	)
}

const ContestScoreboard = (props) => {
	const router = useRouter()
	const { id } = router.query
	const userData = useAuthContext()
	const token = useTokenContext()
	const [contestants, setContestants] = useState([])
	const [problems, setProblems] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const url1 = `${process.env.API_URL}/api/contest/history/${id}`
			const url2 = `${process.env.API_URL}/api/contest/${id}`
			const response1 = await fetch(url1, {
				headers: {
					authorization: userData ? userData.id : '',
				},
			})
			const response2 = await fetch(url2, {
				headers: {
					authorization: token ? token : '',
				},
			})
			const json1 = await response1.json()
			const json2 = await response2.json()
			setContestants(json1)
			setProblems(json2.problem)
		}
		fetchData()
	}, [])

	return (
		<PageLayout>
			<Title icon={faChartArea} noBot='true' text={`Scoreboard #${id}`}>
				<OrangeButton href='/contest/history'>View Contest</OrangeButton>
			</Title>
			<hr />
			<Scoreboard {...{ contestants, problems }} />
		</PageLayout>
	)
}

export default withAuthSync(ContestScoreboard)
