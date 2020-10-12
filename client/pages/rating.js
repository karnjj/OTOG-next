import { useGet } from '../utils/api'

import { Col, Row, Form } from 'react-bootstrap'
import { CustomTable } from '../components/CustomTable'
import { Title, Name } from '../components/CustomText'
import PageLayout from '../components/PageLayout'

import { faChartBar } from '@fortawesome/free-solid-svg-icons'
import { useInput } from '../utils'

const UserTable = ({ users }) => (
  <CustomTable ready={!!users}>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Rating</th>
        <th>Passed</th>
      </tr>
    </thead>
    <tbody>
      {users?.map((user, index) => (
        <tr key={index}>
          <td>{user.rank}</td>
          <td>
            <Name {...user} />
          </td>
          <td>{user.rating}</td>
          <td>0</td>
        </tr>
      ))}
    </tbody>
  </CustomTable>
)

const Rating = () => {
  const { data: users } = useGet('/api/user')
  const [usernameSearch, inputUsernameSearch] = useInput()

  const filteredUsers = users?.filter(
    (user) => user.sname.indexOf(usernameSearch.substr(0, 20)) !== -1
  )

  return (
    <PageLayout>
      <Title icon={faChartBar} text='Ratings' />
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
      <UserTable users={filteredUsers} />
    </PageLayout>
  )
}
export default Rating
