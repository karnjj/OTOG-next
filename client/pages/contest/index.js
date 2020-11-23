import { useAuthContext } from '../../utils/auth'

import { Container, Row, Col } from 'react-bootstrap'

import { faTrophy } from '@fortawesome/free-solid-svg-icons'

import { Title } from '../../components/CustomText'
import PageLayout from '../../components/PageLayout'
import TaskCard from '../../components/TaskCard'
import Timer from '../../components/Timer'
import { Loader } from '../../components/Loader'
import OrangeButton from '../../components/OrangeButton'
import Announce from '../../components/Announce'

import styled from 'styled-components'
import vars from '../../styles/vars'
import { httpGet, useGet } from '../../utils/api'

const CenteredContainer = styled(Container)`
  text-align: center;
  h1 {
    font-size: 300%;
    font-weight: 900;
    margin: 0 0 25px;
  }
  h3 {
    font-weight: bold;
  }
`
const Hero = styled(Container)`
  background: ${(props) => (props.white ? vars.white : vars.grey)};
  min-height: 40vh;
  display: flex;
  align-items: center;
`
const ReponsiveContainer = styled(Container)`
  @media (min-width: 992px) {
    max-width: 800px;
  }
`

const Countdown = ({ timeleft, name, idContest, announce }) => (
  <CenteredContainer>
    <h1>
      การแข่งขัน{' '}
      <Announce idContest={idContest} announce={announce}>
        {name}
      </Announce>{' '}
      กำลังจะเริ่ม
    </h1>
    <h3>
      ในอีก <Timer timeLeft={timeleft} mode='th' />
      ...
    </h3>
  </CenteredContainer>
)

const EndingContest = ({ idContest }) => {
  return (
    <CenteredContainer>
      <h1>การแข่งขันจบแล้ว</h1>
      <OrangeButton
        href='/contest/history/[id]'
        dynamic={`/contest/history/${idContest}`}
        size='lg'
      >
        สรุปผลการแข่งขัน
      </OrangeButton>
    </CenteredContainer>
  )
}

const NoContest = () => {
  const { isAdmin } = useAuthContext()
  return (
    <CenteredContainer>
      <h1>ยังไม่มีการแข่งขัน</h1>
      {isAdmin && (
        <OrangeButton
          href='/contest/submission'
          variant='outline-primary'
          className='mr-2'
        >
          See Submissions
        </OrangeButton>
      )}
      <OrangeButton href='/contest/history'>See Contest History</OrangeButton>
    </CenteredContainer>
  )
}

const NoLogin = () => {
  return (
    <CenteredContainer>
      <h1>กรุณาเข้าสู่ระบบเพื่อแข่งขัน</h1>
    </CenteredContainer>
  )
}

const HoldingContest = ({ idContest, timeleft, name, announce }) => {
  const { isAdmin } = useAuthContext()
  const {
    data: { tasks },
  } = useGet(`/api/contest/${idContest}`)
  return (
    <ReponsiveContainer>
      <Title
        icon={faTrophy}
        right={
          <h2>
            <Timer timeLeft={timeleft} />
          </h2>
        }
      >
        <Announce idContest={idContest} announce={announce}>
          {name}
        </Announce>
      </Title>
      <hr />
      {tasks?.map((task, index) => (
        <TaskCard
          key={task.id_Prob}
          idContest={idContest}
          index={index + 1}
          {...task}
        />
      )) ?? <Loader />}
      {isAdmin && (
        <Row>
          <Col className='d-flex justify-content-end'>
            <OrangeButton
              variant='outline-primary'
              href='/contest/submission'
              className='mr-3'
            >
              See Submissions
            </OrangeButton>
            <OrangeButton
              variant='outline-primary'
              href='/contest/history/[id]'
              dynamic={`/contest/history/${idContest}`}
            >
              Live Scoreboard
            </OrangeButton>
          </Col>
        </Row>
      )}
    </ReponsiveContainer>
  )
}

const Contest = ({ contest, serverTime }) => {
  const { isLogin } = useAuthContext()
  var start,
    now,
    end,
    idContest,
    isAboutToStart,
    isHolding,
    isJustEnd = null
  if (contest) {
    start = contest.time_start
    now = Math.floor(serverTime / 1000)
    end = contest.time_end
    idContest = contest.idContest
    isAboutToStart = now < start
    isHolding = start <= now && now <= end
    isJustEnd = now - end < 60 * 60
  }

  return (
    <PageLayout container={false} fluid className='justify-content-center'>
      <Hero
        white={isLogin && isHolding}
        fluid
        className='justify-content-center p-0'
      >
        {!isLogin ? (
          <NoLogin />
        ) : isAboutToStart ? (
          <Countdown
            timeleft={start - now}
            idContest={idContest}
            name={contest.name}
            announce={contest.announce}
          />
        ) : isHolding ? (
          <HoldingContest
            timeleft={end - now}
            idContest={idContest}
            name={contest.name}
            announce={contest.announce}
          />
        ) : isJustEnd ? (
          <EndingContest idContest={idContest} />
        ) : (
          <NoContest />
        )}
      </Hero>
    </PageLayout>
  )
}

export async function getServerSideProps() {
  const { result, serverTime } = await httpGet('/api/contest')
  return { props: { contest: result[0] ?? null, serverTime } }
}

export default Contest
