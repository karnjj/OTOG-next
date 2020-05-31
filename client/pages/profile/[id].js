import React, { useState, useEffect, Fragment } from 'react'
import { withAuthSync, useAuthContext } from '../../utils/auth'
import { Container, Col, Row, Form, Card } from 'react-bootstrap'
import { faUser } from'@fortawesome/free-solid-svg-icons'
import Header from '../../components/Header'
import Title from '../../components/Title'
import Footer from '../../components/Footer'
import Graph from '../../components/Graph'
import { Name } from '../../components/CustomTable'
import { userClass } from '../../utils/user'
import { useRouter } from 'next/router'
const Rating = () => {
    const [info, setInfo] = useState({})
    const userData = useAuthContext()
    const router = useRouter()
    const { id } = router.query
    useEffect(()=>{
        const fetchData = async () => {
			const url = `${process.env.API_URL}/api/profile/${id}`
			const response = await fetch(url)
			const json = await response.json()
            setInfo(json)  
		}
		fetchData()
    },[])
	return (
		<Fragment>
			<Header />
			<Container> 
            <Title icon={faUser} title='Profile' />
            <Row>
                <Col md={8}>
                    <Card bg='light'>
                        <br/>
                        <Container>
                            <h1><Name score={info.rating}>{info.sname}</Name></h1>
                            <h5><Name score={info.rating}>{userClass(info.rating)}</Name></h5>
                            <h5>Rating : <Name score={info.rating}>{info.rating}</Name> (max : <Name score={0}>-</Name>)</h5>
                            <h5>Contest Participate : -</h5>
                            <h5>Problem Solve : -</h5>
                            <br/>
                            <Graph/>
                            <br/>
                        </Container>
                    </Card>
                </Col>
                <Col md={4}>
                    <br/>
                    <Card bg='light'>
                        <img src={`${process.env.API_URL}/api/avatar/${id}`} className="card-img-top" alt="Profile Image"/>
                        <Card.Body>
                            <Card.Title >Trophy</Card.Title>
                            <Row>
                                <Col>
                                    <p>Champion🏆:<br/>-</p>
                                </Col>
                                <Col>
                                    <p>Perfect Score🎯:<br/>-</p>
                                </Col>                   
                            </Row>
                            <Row>
                                <Col>
                                    <p>First Blood💀:<br/>-</p>
                                </Col>
                                <Col>
                                    <p>One man solve🥇:<br/>-</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        <Footer/>
        </Container>
		</Fragment>
	)
}
export default withAuthSync(Rating)
