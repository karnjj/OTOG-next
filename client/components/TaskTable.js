import { memo } from 'react'
import { useAuthContext } from '../utils/auth'

import { Popover, OverlayTrigger, Row, Col } from 'react-bootstrap'
import { TableRow, CustomTable } from './CustomTable'
import { RowSkeleton } from './Loader'

import SubmitGroup from './SubmitGroup'
import ViewCodeButton from './ViewCodeButton'
import styled from 'styled-components'
import { RenderOnIntersect } from './RenderOnIntersect'
import { useRouter } from 'next/router'

const StyledPop = styled(Popover)`
  max-width: none;
`

const TaskTable = ({ isLoading, tasks }) => {
  const { isLogin } = useAuthContext()

  return (
    <CustomTable isLoading={isLoading}>
      <thead>
        <RenderOnIntersect id='tasks/head' initialHeight='50px' as='tr'>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Passed</th>
            <th>Ratings</th>
            {isLogin && <th>Submit</th>}
          </tr>
        </RenderOnIntersect>
      </thead>
      <tbody>
        {tasks?.map((prob) => (
          <TaskRow key={prob.id_Prob} {...prob} />
        ))}
      </tbody>
    </CustomTable>
  )
}

const TaskRow = memo((props) => {
  const {
    id_Prob,
    name,
    time,
    memory,
    sname,
    rating,
    pass,
    acceptState,
    wrongState,
  } = props
  const { isLogin } = useAuthContext()

  const router = useRouter()

  const passed = []
  if (pass) {
    for (let i = 0; i < pass.length; i += 15) {
      passed.push(pass.slice(i, i + 15))
    }
  }
  return (
    <RenderOnIntersect id={`tasks/${id_Prob}`} initialHeight='73px' as='tr'>
      <TableRow acceptState={acceptState} wrongState={wrongState}>
        <td>{id_Prob}</td>
        <td>
          <a target='_blank' href={`${process.env.API_URL}/api/docs/${sname}`}>
            {name}
            <br />({time} วินาที {memory} MB)
          </a>
        </td>
        <td>
          {pass ? (
            <OverlayTrigger
              placement='top'
              overlay={
                <StyledPop>
                  <Popover.Content as={Row}>
                    {passed.map((names, i) => (
                      <Col key={i}>
                        {names.map((name, j) => (
                          <div key={j}>• {name}</div>
                        ))}
                      </Col>
                    ))}
                  </Popover.Content>
                </StyledPop>
              }
            >
              <div>{pass.length}</div>
            </OverlayTrigger>
          ) : (
            <>0</>
          )}
        </td>
        <td>{rating ? rating : '-'}</td>
        {isLogin && (
          <td>
            <SubmitGroup
              {...props}
              callback={() => {
                router.push('/submission')
              }}
            >
              {(acceptState || wrongState) && (
                <ViewCodeButton id_Prob={id_Prob} taskName={name} />
              )}
            </SubmitGroup>
          </td>
        )}
      </TableRow>
    </RenderOnIntersect>
  )
})

export default TaskTable
