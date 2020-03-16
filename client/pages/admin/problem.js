import { useState, useEffect } from 'react'
import { withAuthSync } from '../../utils/auth'
import fetch from 'isomorphic-unfetch'

const Problem = (props) => {
	const userData = props.jsData
	const [taskState, setTaskState] = useState([])
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/admin/problem`
			let headers = { "Content-Type": "application/json" }
            headers["Authorization"] = userData ? userData.id : '';
            const res = await fetch(url, { headers, })
			const json = await res.json()
			setTaskState(json)
		}
		fetchData()
    }, [])
	return (
		<div>
            {taskState.map(prob => <li>{prob.name}</li>)}
		</div>
	)
}

export default withAuthSync(Problem)