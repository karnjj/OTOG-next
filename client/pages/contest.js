import Error from 'next/error'
import { withAuthSync } from '../utils/auth'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import fetch from 'isomorphic-unfetch'

const Contest = () => {
	const [contest,setContest] = useState([])
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest`
			const response = await fetch(url)
			const data = await response.json()
			setContest(data)
		}
		fetchData()
	}, [])
	return (
		<>
			<Header />
			{contest.map((con) => {
				return <li>{con.name}</li>
			})}
		</>
	)
}
export default withAuthSync(Contest)
