import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import { withAuthSync } from '../utils/auth'

import { Container, Col, Row, Form } from 'react-bootstrap'
import UserTable from '../components/UserTable'
import Title from '../components/Title'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { faChartBar } from '@fortawesome/free-solid-svg-icons'

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
	}, [])
	const updateSearch = event => {
		setsearchState(event.target.value.substr(0, 20))
	}
	let filteredUser = userState.filter(user => {
		return user.sname.indexOf(searchState) !== -1
	})
	return (
		<>
			<Header />
			<Container>
				<Title icon={faChartBar} title='Rating' />
				<Row className='align-items-baseline'>
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
				<Footer />
			</Container>
		</>
	)
}
export default withAuthSync(Rating)
