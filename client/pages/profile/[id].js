import { userClass } from '../../utils/user'

import { Col, Row, Card } from 'react-bootstrap'
import { Title, ColoredText } from '../../components/CustomText'
import PageLayout from '../../components/PageLayout'
import Graph from '../../components/Graph'

import styled from 'styled-components'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { httpGet } from '../../utils/api'

const CustomCard = styled(Card)`
  height: 100%;
`
const ImageCustomCard = styled(CustomCard)`
  width: 345px;
`
const GraphCard = ({ userInfo }) => (
  <CustomCard bg='light'>
    <Card.Body>
      <Card.Text as='div' className='pl-3 pb-3'>
        <h1>
          <ColoredText {...userInfo}>{userInfo.sname}</ColoredText>
        </h1>
        <h5>
          <ColoredText {...userInfo}>{userClass(userInfo)}</ColoredText>
        </h5>
        <h5>
          Rating : <ColoredText {...userInfo}>{userInfo.rating}</ColoredText>{' '}
          {userInfo.mxRating && (
            <text>
              (max :{' '}
              <ColoredText rating={userInfo.mxRating}>
                {userInfo.mxRating}
              </ColoredText>
              )
            </text>
          )}
        </h5>
        <h5>Participated Contests : {userInfo.history.length}</h5>
        <h5>Solved Tasks: -</h5>
      </Card.Text>
      <Graph {...userInfo} />
    </Card.Body>
  </CustomCard>
)

const ImageCard = ({ userInfo, id }) => (
  <ImageCustomCard bg='light'>
    <Card.Img
      variant='top'
      src={`${process.env.API_URL}/api/avatar/${id}`}
      alt='Profile Image'
    />
    <Card.Body>
      <Card.Title>Trophy</Card.Title>
      <Row>
        <Col>
          <p>
            Champion 🏆:
            <br />-
          </p>
        </Col>
        <Col>
          <p>
            Perfect Score 🎯: <br />-
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            First Blood 💀: <br />-
          </p>
        </Col>
        <Col>
          <p>
            One Man Solve 🥇:
            <br />-
          </p>
        </Col>
      </Row>
    </Card.Body>
  </ImageCustomCard>
)

const Profile = (props) => (
  <PageLayout>
    <Title icon={faUser}>Profile</Title>
    <hr />
    <Row xs={1} lg={2}>
      <Col lg={7} xl={8} className='mb-3 mb-lg-0'>
        <GraphCard {...props} />
      </Col>
      <Col
        lg={5}
        xl={4}
        className='d-flex justify-content-center align-item-center py-3'
      >
        <ImageCard {...props} />
      </Col>
    </Row>
  </PageLayout>
)

Profile.getInitialProps = async ({ query: { id } }) => {
  const userInfo = await httpGet(`/api/profile/${id}`)
  return { id, userInfo }
}

export default Profile
