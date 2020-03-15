import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import ProbTable from '../../components/ProbTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
	import { withAuthSync } from '../../utils/auth';
const Problem = (props) => {
	const userData = props.jsData
	const [taskState, setTaskState] = useState([])
	const [searchState, setsearchState] = useState('')
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/problem?mode=full`
			let headers = { "Content-Type": "application/json" }
            headers["Authorization"] = userData ? userData.id : '';
            const res = await fetch(url, { headers, })
			const json = await res.json()
			setTaskState(json)
		}
		fetchData()
	}, [])
	const updateSearch = (event) => {
		setsearchState(event.target.value.substr(0, 20))
	}
	let filteredTask = taskState.filter((problem) => {
		let id = String(problem.id_Prob)
		return (problem.name.indexOf(searchState) !== -1) || (id.indexOf(searchState) !== -1
		)
	})
	return (
		<>
			<div className="container">
				<br /><br /><br /><h2> <FontAwesomeIcon icon={faPuzzlePiece}/> Problem </h2><br />
				<div className="row m-auto justify-content-between align-items-baseline">
					<input className="col-12 col-sm-6 col-md-8 form-control" placeholder="ค้นหาโจทย์"
						value={searchState}
						onChange={updateSearch} />
					<a href="submission" className="col-12 col-sm-4 col-md-3 col-lg-2 btn otogbtn mt-1">View Submission</a>
				</div> <hr></hr>
				<ProbTable problems={filteredTask} {...{ userData }} />
			</div>
		</>
	)
}

export default withAuthSync(Problem)