import { withAuthSync } from '../utils/auth'

import { Container, Col } from 'react-bootstrap'
import OrangeButton from '../components/OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'


const Submission = (props) => {
    return (
        <>
            <Container>
                <br/><br/><br/>
                <h2><FontAwesomeIcon icon={faPuzzlePiece}/> Submission</h2>
                <br/>
                <Col>
                    <OrangeButton href='problem' className='m-auto'>View Problem</OrangeButton>
                </Col>
            </Container>
        </>
    )
}

export default withAuthSync(Submission)