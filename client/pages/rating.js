import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import { withAuthSync } from '../utils/auth'

import { Container, Col, Row, Form } from 'react-bootstrap'
import { CustomTable } from '../components/CustomTable'
import { Title, Name } from '../components/CustomText'
import PageLayout from '../components/PageLayout'

import { faChartBar } from '@fortawesome/free-solid-svg-icons'

const UserTable = (props) => (
	<CustomTable ready={props.users.length}>
		<thead>
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>Rating</th>
				<th>Passed</th>
			</tr>
		</thead>
		<tbody>
			{props.users.map((user, index) => (
				<tr key={index}>
					<td>{user.rank}</td>
					<td>
						<Name {...user} />
					</td>
					<td>{user.rating}</td>
					<td>0</td>
				</tr>
			))}
		</tbody>
	</CustomTable>
)

const Rating = () => {
	const [userState, setUserState] = useState([])
	const [searchState, setsearchState] = useState('')
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/user`
			const res = await fetch(url)
			const json = await res.json()
			setUserState(json)
		}
		fetchData()
		return function cleanup() {
			setUserState([])
		}
	}, [])
	const updateSearch = (event) => {
		setsearchState(event.target.value.substr(0, 20))
	}
	let filteredUser = userState.filter((user) => {
		return user.sname.indexOf(searchState) !== -1
	})

	return (
		<PageLayout>
			<Title icon={faChartBar} text='Rating' />
			<Row className='mx-auto align-items-baseline'>
				<Col as='label' md={2}>
					<b>ค้นหาผู้ใช้ : </b>
				</Col>
				<Col
					as={Form.Control}
					md={6}
					placeholder='ค้นหาผู้ใช้'
					value={searchState}
					onChange={updateSearch}
				/>
				<Col md={4}></Col>
			</Row>
			<hr />
			<UserTable users={filteredUser} />
		</PageLayout>
	)
}
export default withAuthSync(Rating)
