import { useEffect, useState } from 'react'
import { useTokenContext, withAdminAuth } from '../../utils/auth'

import { Title } from '../../components/CustomText'
import PageLayout from '../../components/PageLayout'
import OrangeButton from '../../components/OrangeButton'
import SubmissionTable from '../../components/SubmissionTable'

import { faTrophy } from '@fortawesome/free-solid-svg-icons'

const Submission = () => {
	const token = useTokenContext()
	const [results, setResults] = useState()

	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest/submission`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = token ? token : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setResults(json.result)
		}
		fetchData()
	}, [])

	return (
		<PageLayout noFooter>
			<Title icon={faTrophy} text='Contest Submission' noBot='true'>
				<OrangeButton href='/contest'>View Contest</OrangeButton>
			</Title>
			<hr />
			<SubmissionTable {...{ results }} />
		</PageLayout>
	)
}

export default withAdminAuth(Submission)
