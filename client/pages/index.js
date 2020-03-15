import { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import { withAuthSync, isLogin } from '../utils/auth'

import { Jumbotron, Container, Row, Col } from 'react-bootstrap'
import Hello from '../components/Hello'
import Welcome from '../components/Welcome'
import ProbTable from '../components/ProbTable'
import OrangeButton from '../components/OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faFlagCheckered, faTrophy, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'

const Index = (props) => {
    const userData = props.jsData
    const [taskState, setTaskState] = useState([])
    
    useEffect(() => {
        const fetchData = async () => {
            const url = `${process.env.API_URL}/api/problem?mode=firstpage`
            let headers = { "Content-Type": "application/json" }
            headers["Authorization"] = userData ? userData.id : '';
            const res = await fetch(url, { headers, })
            const json = await res.json()
            setTaskState(json)
        }
        fetchData()
    }, [])
    
    return (
        <>
            <Jumbotron>
                <Container>
                {isLogin(userData) ? <Hello {...{userData}}/> : <Welcome/>}
                </Container>
            </Jumbotron>
            <Container>
                <Row>
                    <Col md={4} className="px-5 p-md-3">
                        <h2><FontAwesomeIcon icon={faQuestion} /> FAQ</h2>
                        <p> ไม่รู้ว่าจะเริ่มต้นอย่างไร ทุกอย่างดูงงไปหมด ถ้าหากคุณมีปัญหาเหล่านี้สามารถ หาคำตอบได้จาก คำถามยอดนิยมที่ผู้ใช้ส่วนใหญ่มักจะถามเป็นประจำ </p>
                        <OrangeButton size='lg' href="#" target="_blank">Learn More</OrangeButton>
                        <br /><br />
                    </Col>
                    <Col md={4} className="px-5 p-md-3">
                        <h2><FontAwesomeIcon icon={faFlagCheckered} /> Get started</h2>
                        <p> เพิ่งเริ่มการเดินทาง อาจจะอยากได้การต้อนรับที่ดี ด้วยโจทย์ที่คัดสรรว่าเหมาะสำหรับผู้เริ่มต้นใน competitive programming </p>
                        <OrangeButton size='lg' href="problems" target="_blank">View Problem</OrangeButton>
                        <br /><br />
                    </Col>
                    <Col md={4} className="px-5 p-md-3">
                        <h2><FontAwesomeIcon icon={faTrophy} /> Contest</h2>
                        <p> ทำโจทย์คนเดียวมันอาจจะเหงา ลองมาเข้า contest การแข่งขันอันทรงเกียรติ (?) เพื่อจะได้มีเพื่อนทำโจทย์และแข่งขันไปพร้อมๆกันกับเรา </p>
                        <OrangeButton size='lg' href="contest" target="_blank">Join Contest</OrangeButton>
                        <br /><br />
                    </Col>
                </Row>
                <div>
                    <i className="glyphicon glyphicon-asterisk"></i>
                    <h2><FontAwesomeIcon icon={faPuzzlePiece} /> โจทย์ใหม่</h2>
                </div>
                <hr />
                <ProbTable problems={taskState} {...{userData}} />
            </Container>
        </>
    )
}
export default withAuthSync(Index)