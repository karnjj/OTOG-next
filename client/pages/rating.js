import { useGet } from '../utils/api'

import { Col, Row, Form } from 'react-bootstrap'
import { CustomTable } from '../components/CustomTable'
import { Title, Name } from '../components/CustomText'
import PageLayout from '../components/PageLayout'

import { faChartBar } from '@fortawesome/free-solid-svg-icons'
import { useInput } from '../utils'
import { RenderOnIntersect } from '../components/RenderOnIntersect'
import { useMemo } from 'react'

const UserTable = ({ users, isLoading }) => (
  <CustomTable isLoading={isLoading}>
    <thead>
      <RenderOnIntersect id='users/header' initialHeight='50px' as='tr'>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Rating</th>
          <th>Solved</th>
        </tr>
      </RenderOnIntersect>
    </thead>
    <tbody>
      {users?.map((user) => (
        <RenderOnIntersect
          key={user.idUser}
          id={`users/${user.idUser}`}
          initialHeight='49px'
          as='tr'
        >
          <tr>
            <td>{user.rank}</td>
            <td>
              <Name {...user} />
            </td>
            <td>{user.rating}</td>
            <td>0</td>
          </tr>
        </RenderOnIntersect>
      ))}
    </tbody>
  </CustomTable>
)

const Rating = () => {
  const {
    data: { users },
    isLoading,
  } = useGet('/api/user')
  const [usernameSearch, inputUsernameSearch] = useInput()

  const filteredUsers = useMemo(
    () =>
      users?.filter(
        (user) =>
          user.sname.toLowerCase().indexOf(usernameSearch.toLowerCase()) !== -1
      ),
    [users, usernameSearch]
  )
  return (
    <>
      <Row className='mx-auto align-items-baseline'>
        <Col as='label' md={2}>
          <b>ค้นหาผู้ใช้ : </b>
        </Col>
        <Col
          as={Form.Control}
          md={6}
          placeholder='ค้นหาผู้ใช้'
          {...inputUsernameSearch}
        />
        <Col md={4} />
      </Row>
      <hr />
      <UserTable users={filteredUsers} isLoading={isLoading} />
    </>
  )
}

const RatingPage = () => {
  return (
    <PageLayout>
      <Title icon={faChartBar}>Ratings</Title>
      <Rating />
    </PageLayout>
  )
}
export default RatingPage
