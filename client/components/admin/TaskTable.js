import { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'

import { Table, ButtonGroup, Button } from 'react-bootstrap'
import { Alink } from '../CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPencilAlt,
	faSyncAlt,
	faEye,
	faEyeSlash,
	faTrash,
	faPlusCircle
} from '@fortawesome/free-solid-svg-icons'

export const NewProblem = () => {
	return (
		<Button variant='success' size='lg'>
			<FontAwesomeIcon icon={faPlusCircle} /> New Problem
		</Button>
	)
}

const ConfigTask = props => {
	const { state } = props
	return (
		<ButtonGroup>
			<Button variant='info'>
				{' '}
				<FontAwesomeIcon icon={faPencilAlt} />
			</Button>
			<Button variant='warning'>
				<FontAwesomeIcon icon={faSyncAlt} />
			</Button>
			<Button variant={state ? 'light' : 'dark'}>
				<FontAwesomeIcon icon={state ? faEye : faEyeSlash} />
			</Button>
			<Button variant='danger'>
				{' '}
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		</ButtonGroup>
	)
}

export const TaskTable = ({ userData }) => {
	const [taskState, setTaskState] = useState([])
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/admin/problem`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setTaskState(json)
		}
		fetchData()
	}, [])
	return (
		<Table responsive hover>
			<thead className='thead-light'>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Time</th>
					<th>Memory</th>
					<th>Config</th>
				</tr>
			</thead>
			<tbody>
				{taskState.map(prob => {
					const { name, id_Prob, time, memory, sname, state } = prob
					return (
						<tr key={id_Prob}>
							<td>{id_Prob}</td>
							<td>
								<Alink
									target='_blank'
									href={`${process.env.API_URL}/api/docs/${sname}`}
								>
									{name}
								</Alink>
							</td>
							<td>{time}</td>
							<td>{memory}</td>
							<td>
								<ConfigTask {...prob} />
							</td>
						</tr>
					)
				})}
			</tbody>
		</Table>
	)
}
