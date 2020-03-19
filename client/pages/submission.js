import { withAuthSync } from '../utils/auth'

import { Container, Row, Col } from 'react-bootstrap'
import { Alink } from '../components/CustomTable'
import OrangeButton from '../components/OrangeButton'
import SubmissionTable from '../components/SubmissionTable'
import SubmitGroup from '../components/SubmitGroup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'


const Submission = (props) => {
    const userData = props.jsData
    //const { name, sname } = props.latestProblem
    const { name, sname } = { name: 'ห้ามขายโพชั่นศักดิ์สิทธิ์ให้แก่ผู้ที่มีอายุไม่ถึง 20 ปีบริบูรณ์ [C only]', sname: 'a4_ratri' }
    const filteredSubmission = [
        {username:'anos_136', name: 'pattern_0', time: '0.00', score:'0', result:'--', submitNumber:'69690'},
        {username:'anos_136', name: 'pattern_0', time: '0.00', score:'0', result:'--', submitNumber:'69691'},
        {username:'anos_136', name: 'pattern_0', time: '0.00', score:'0', result:'--', submitNumber:'69692'},
        {username:'anos_136', name: 'pattern_0', time: '0.00', score:'0', result:'--', submitNumber:'69693'},
        {username:'anos_136', name: 'pattern_0', time: '0.00', score:'0', result:'--', submitNumber:'69694'},
        {username:'anos_136', name: 'pattern_0', time: '0.00', score:'0', result:'--', submitNumber:'69695'},
        {username:'anos_136', name: 'pattern_0', time: '0.00', score:'0', result:'--', submitNumber:'69696'},
        {username:'anos_136', name: 'pattern_0', time: '0.00', score:'100', result:'BIGPP', acceptState: true, submitNumber:'69420'},
    ]
    return (
        <Container>
            <br/><br/><br/>
            <h2><FontAwesomeIcon icon={faPuzzlePiece}/> Submission</h2>
            <br/>
            <Row className='m-auto align-items-baseline'>
                {
                <Col className='mr-auto'>
					<div className='d-flex align-items-baseline'>
						<b>ส่งข้อล่าสุด :</b>
                        <Alink 
                            target='_blank'
                            className='mx-4'
                            href={`${process.env.API_URL}/api/docs/${sname}`}
                        >{name}</Alink>
                        <SubmitGroup {...{name, sname}}/>
					</div>
				</Col>
                }
                <Col as={OrangeButton} href='problem' sm={4} md={3} lg={2}>View Problem</Col>
            </Row>
            <hr/>
            <SubmissionTable results={filteredSubmission} {...{userData}}/>
        </Container>
    )
}

export default withAuthSync(Submission)