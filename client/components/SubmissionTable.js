import { useEffect, memo } from 'react'
import { useAuthContext } from '../utils/auth'
import { timeToString, useShow } from '../utils'

import { TableRow, CustomTable } from './CustomTable'
import { Modal, ButtonGroup } from 'react-bootstrap'
import { Name, Alink, ResultCode } from './CustomText'
import ViewCodeButton from './ViewCodeButton'

import styled from 'styled-components'
import prism from 'prismjs'

const FontPre = styled.pre`
  span,
  code {
    font-family: 'Fira Code', 'Courier New', Courier, monospace;
  }
`

const SubmissionTable = ({ isLoading, results, canViewCode }) => {
  const { isAdmin } = useAuthContext()
  const showCode = canViewCode || isAdmin

  return (
    <CustomTable isLoading={!results || isLoading}>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Task</th>
          <th>Result</th>
          <th>Time</th>
          <th>Score</th>
          {showCode && <th>Code</th>}
        </tr>
      </thead>
      <tbody>
        {results?.map((result) => (
          <SubRow key={result.idResult} {...result} canViewCode={showCode} />
        ))}
      </tbody>
    </CustomTable>
  )
}

const SubRow = memo((props) => {
  const [showError, handleShow, handleClose] = useShow(false)
  const {
    problemname,
    state,
    timeuse,
    score,
    result,
    idResult,
    errmsg,
    canViewCode,
    name,
    sname,
    rating,
    idUser,
    time,
  } = props

  const isAccept = (result) =>
    result
      .split('')
      .filter((res) => res !== '[' && res !== ']')
      .every((res) => res === 'P')
  const round = (num) => Math.round(num * 100) / 100

  useEffect(() => {
    if (showError) {
      prism.highlightAll()
    }
  }, [showError])

  return (
    <>
      <TableRow acceptState={isAccept(result)}>
        <td title={timeToString(time)}>{idResult}</td>
        {state != 0 ? (
          <td>
            <Name {...{ sname, rating, idUser }} />
          </td>
        ) : (
          <td>{sname}</td>
        )}
        <td>
          <Alink
            target='_blank'
            href={`${process.env.API_URL}/api/docs/${problemname}`}
          >
            {name}
          </Alink>
        </td>
        <td>
          <ResultCode>
            {result === 'Compilation Error' && canViewCode ? (
              <Alink onClick={handleShow}>{result}</Alink>
            ) : (
              result
            )}
          </ResultCode>
        </td>
        <td>{timeuse} s</td>
        <td>{round(score)}</td>
        {canViewCode && (
          <td>
            <ButtonGroup>
              <ViewCodeButton idResult={idResult} />
            </ButtonGroup>
          </td>
        )}
      </TableRow>

      <Modal show={showError} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Error : {idResult}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FontPre>
            <code className={`language-cpp`}>{errmsg}</code>
          </FontPre>
        </Modal.Body>
      </Modal>
    </>
  )
})

export default SubmissionTable
