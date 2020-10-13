import { useAuthContext } from '../utils/auth'
import { Jumbotron, Container, Row, Col } from 'react-bootstrap'
import { Title } from '../components/CustomText'
import PageLayout from '../components/PageLayout'
import TaskTable from '../components/TaskTable'
import OrangeButton from '../components/OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faQuestion,
  faFlagCheckered,
  faTrophy,
  faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons'

import styled, { keyframes } from 'styled-components'
import vars from '../styles/vars'

import CountUp from 'react-countup'
import { lighten } from 'polished'
import { down } from 'styled-breakpoints'
import { useGet } from '../utils/api'

const WelcomeText = styled.h4`
  color: ${vars.black};
  text-align: center;
`
const fadein = keyframes`
	0% {
		opacity: 0;
		transform : translateY(-5px);
	}
	100% {
		opacity: 1;
		transform: translateY(0px);
	}
`
const AliveText = styled.h6`
  color: ${vars.black};
  text-align: center;
  min-height: 4rem;
  font-weight: 400;
  max-width: 900px;
  overflow-wrap: break-word;
`
const Number = styled(CountUp)`
  color: ${vars.white};
  font-family: Calibri;
  font-size: 50px;
  margin-top: -5px;
  font-weight: 100;
  text-align: center;
`
const Message = styled.h5`
  color: ${vars.white};
  font-family: Calibri;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 0px;
  font-weight: 600;
  text-align: center;
`
const popin = keyframes`
	0% {
		transform: scale(0);
	}
	90% {
		transform: scale(1.05);
	}
	100% {
		transform: scale(1);
	}
`
const CountButton = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  background: ${(props) => lighten(0.05, props.color)};
  box-shadow: 0 5px ${vars.btn_gray};
  border-radius: 1rem;
  width: 128px;
  height: 95px;
  padding: 20px;
  margin: 6px 3px;
  transition: background-color 0.1s;
  &:hover {
    background: ${(props) => lighten(0.08, props.color)};
  }
  &:active {
    background: ${(props) => props.color};
    transform: translateY(3px);
    box-shadow: 0 2px ${vars.btn_gray};
  }
  animation: ${popin} 0.25s ease backwards
    ${(props) => props.index * 0.01 + 's'};
  animation-play-state: ${(props) => !props.number && 'pause'};
  animation-delay: ${(props) => props.index * 20}ms;
`
const ButtonWrapper = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style: none;
`

const Code = styled.code`
  padding: 0 8px;
  font-size: 2.4rem;
  font-weight: bold;
  color: ${(props) => props.color};
`
const StyledWelcome = styled.div`
  ${down('xl')} {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const Welcome = () => (
  <StyledWelcome>
    <h1>
      Welcome to <Code color={vars.green}>O</Code>
      <Code color={vars.red}>T</Code>
      <Code color={vars.orange}>O</Code>
      <Code color={vars.blue}>G</Code>
    </h1>
    <h1>Become a god of competitive programming.</h1>
    <h3>Learn how to code and build algorithms efficiently.</h3>
    <br />
    <OrangeButton size='lg' href='register' target='_blank'>
      Sign Up
    </OrangeButton>
  </StyledWelcome>
)

const Hello = () => {
  const { userData } = useAuthContext()
  const { data = {} } = useGet('/api/countProblem')
  const { allProblem, userProblem = {}, newProb, onlineUser } = data
  const { passProb, wrongProb } = userProblem
  const noSub = allProblem - passProb - wrongProb

  return (
    <>
      <Row>
        <Col as={WelcomeText}>สวัสดี {userData.sname}</Col>
      </Row>
      <Row>
        <Col as={ButtonWrapper}>
          {[
            //message,  number,     color
            ['ทั้งหมด', allProblem, vars.btn_black],
            ['ผ่านแล้ว', passProb, vars.btn_green],
            ['ยังไม่ผ่าน', wrongProb, vars.btn_red],
            ['ยังไม่ส่ง', noSub, vars.btn_orng],
            ['โจทย์วันนี้', newProb, vars.btn_blue],
          ].map(([message, number, color], index) => (
            <CountButton {...{ number, color, index }} key={index}>
              <Message>{message}</Message>
              <Number end={number ? number : 0} />
            </CountButton>
          ))}
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col as={AliveText}>
          <b>ยังมีชีวิตรอด : </b>
          {onlineUser?.map((user) => user.sname).join(', ') ?? '. . .'}
        </Col>
      </Row>
    </>
  )
}

const NewTaskTable = () => {
  const { data: tasks = [], isLoading } = useGet('/api/problem?mode=firstpage')
  return <TaskTable problems={tasks} isLoading={isLoading} />
}

const Index = () => {
  const { isLogin } = useAuthContext()

  return (
    <PageLayout container={false}>
      <Jumbotron fluid>
        <Container>{isLogin ? <Hello /> : <Welcome />}</Container>
      </Jumbotron>
      <Container>
        <Row xs={1} md={3}>
          <Col className='px-5 p-md-3'>
            <h2>
              <FontAwesomeIcon icon={faQuestion} /> FAQ
            </h2>
            <p>
              ไม่รู้ว่าจะเริ่มต้นอย่างไร ทุกอย่างดูงงไปหมด
              ถ้าหากคุณมีปัญหาเหล่านี้สามารถ หาคำตอบได้จาก
              คำถามยอดนิยมที่ผู้ใช้ส่วนใหญ่มักจะถามเป็นประจำ
            </p>
            <a
              href='https://medium.com/otog/complete-guide-to-otog-22f88a349e78'
              target='_blank'
            >
              <OrangeButton size='lg'>Learn More</OrangeButton>
            </a>
            <br />
            <br />
          </Col>
          <Col className='px-5 p-md-3'>
            <h2>
              <FontAwesomeIcon icon={faFlagCheckered} /> Get started
            </h2>
            <p>
              เพิ่งเริ่มการเดินทาง อาจจะอยากได้การต้อนรับที่ดี
              ด้วยโจทย์ที่คัดสรรว่าเหมาะสำหรับผู้เริ่มต้นใน competitive
              programming
            </p>
            <OrangeButton size='lg' href='task'>
              View Tasks
            </OrangeButton>
            <br />
            <br />
          </Col>
          <Col className='px-5 p-md-3'>
            <h2>
              <FontAwesomeIcon icon={faTrophy} /> Contest
            </h2>
            <p>
              ทำโจทย์คนเดียวมันอาจจะเหงา ลองมาเข้า contest
              การแข่งขันอันทรงเกียรติ (?)
              เพื่อจะได้มีเพื่อนทำโจทย์และแข่งขันไปพร้อม ๆ กันกับเรา
            </p>
            <OrangeButton size='lg' href='contest'>
              Join Contest
            </OrangeButton>
            <br />
            <br />
          </Col>
        </Row>
        <div>
          <i className='glyphicon glyphicon-asterisk'></i>
          <Title icon={faPuzzlePiece} text='โจทย์ใหม่' noBot='true' />
        </div>
        <hr />
        <NewTaskTable />
      </Container>
    </PageLayout>
  )
}

export default Index
