import React, { useState, useEffect } from 'react';
import App from '../components/App'
import fetch from 'isomorphic-unfetch'
import Header from '../components/Header'
import ProbTABLE from '../components/ProbTable';
import { withAuthSync, isLogin } from '../utils/auth'
import Welcome from '../components/Welcome';
const Index = (props) => {
    const userData = props.jsData
    const [taskState, setTaskState] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8000/api/problem?mode=firstpage')
            const json = await res.json()
            setTaskState(json)
          }
        fetchData()
    },[])
    return (
        <App>
            <Header userData={userData}/>
            <div className="jumbotron">
                <div className="container">
                    {isLogin(userData) ? <Welcome /> : <div>
                        <h1>Welcome to <b>
                            <code className="font_green">O</code>
                            <code className="font_red">T</code>
                            <code className="font_org">O</code>
                            <code className="font_blue">G</code>
                        </b></h1>
                        <h1>Become a god of competitive programming.</h1>
                        <h3>Learn how to code and build algorithms efficiently.</h3><br />
                        <a href="register" target="_blank" className="btn btn-lg otogbtn">Sign Up</a>
                    </div>}
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 suggest px-5 p-md-3">
                        <h2><i className="fa fa-question"></i> FAQ</h2>
                        <p> ไม่รู้ว่าจะเริ่มต้นอย่างไร ทุกอย่างดูงงไปหมด ถ้าหากคุณมีปัญหาเหล่านี้สามารถ หาคำตอบได้จาก คำถามยอดนิยมที่ผู้ใช้ส่วนใหญ่มักจะถามเป็นประจำ </p>
                        <a href="#" target="_blank" className="btn btn-lg otogbtn">Learn More</a>
                        <br /><br />
                    </div>
                    <div className="col-md-4 suggest px-5 p-md-3">
                        <h2><i className="fa fa-flag-checkered"></i> Get started</h2>
                        <p> เพิ่งเริ่มการเดินทาง อาจจะอยากได้การต้อนรับที่ดี ด้วยโจทย์ที่คัดสรรว่าเหมาะสำหรับผู้เริ่มต้นใน competitive programming </p>
                        <a href="problems" target="_blank" className="btn btn-lg otogbtn">View Problem</a>
                        <br /><br />
                    </div>
                    <div className="col-md-4 suggest px-5 p-md-3">
                        <h2><i className="fa fa-trophy"></i> Contest</h2>
                        <p> ทำโจทย์คนเดียวมันอาจจะเหงา ลองมาเข้า contest การแข่งขันอันทรงเกียรติ (?) เพื่อจะได้มีเพื่อนทำโจทย์และแข่งขันไปพร้อมๆกันกับเรา </p>
                        <a href="contest" target="_blank" className="btn btn-lg otogbtn">Join Contest</a>
                        <br /><br />
                    </div>
                </div>
                <div>
                    <i className="glyphicon glyphicon-asterisk"></i>
                    <h2><i className="fa fa-puzzle-piece"></i> โจทย์ใหม่</h2>
                </div>
                <hr />
                <ProbTABLE problem={taskState}/>
            </div>
        </App>
    )
}
export default withAuthSync(Index)