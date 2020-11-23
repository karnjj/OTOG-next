import { useEffect, memo } from 'react'
import { useAuthContext } from '../utils/auth'
import { timeToString, useShow } from '../utils'

import { TableRow, CustomTable } from './CustomTable'
import { Modal, ButtonGroup } from 'react-bootstrap'
import { Name, Alink, ResultCode } from './CustomText'
import ViewCodeButton from './ViewCodeButton'

import styled from 'styled-components'
import prism from 'prismjs'
import { useGet } from '../utils/api'

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
          <SubRow
            key={result.idResult}
            result={result}
            canViewCode={showCode}
          />
        ))}
      </tbody>
    </CustomTable>
  )
}

const SubRow = memo((props) => {
  const [showError, handleShow, handleClose] = useShow(false)
  const { result, canViewCode } = props

  const {
    data,
    isValidating,
    mutate: fetchResult,
  } = useGet(`/api/submission/${result.idResult}`, {
    initialData: result,
    revalidateOnMount: false,
    revalidateOnFocus: false,
  })
  const {
    problemname,
    state,
    timeuse,
    score,
    result: resultCode,
    idResult,
    errmsg,
    name,
    sname,
    rating,
    idUser,
    time,
    status,
  } = data

  useEffect(() => {
    const isGrading = !isValidating && status === 0
    const timeout = isGrading && setTimeout(fetchResult, 1000)
    return () => clearTimeout(timeout)
  }, [isValidating])

  const isAccept = (resultCode) =>
    resultCode
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
      <TableRow acceptState={isAccept(resultCode)}>
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
            {resultCode === 'Compilation Error' && canViewCode ? (
              <Alink onClick={handleShow}>{resultCode}</Alink>
            ) : (
              resultCode
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
