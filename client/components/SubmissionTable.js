import { useEffect, memo } from 'react'
import { useAuthContext } from '../utils/auth'
import { useShow } from '../utils'

import { CustomTr, CustomTable } from './CustomTable'
import { Modal, ButtonGroup } from 'react-bootstrap'
import { Name, Alink } from './CustomText'
import ViewCodeButton from './ViewCodeButton'

import styled from 'styled-components'
import prism from 'prismjs'
import vars from '../styles/vars'
import { RenderOnIntersect } from './RenderOnIntersect'

const FontPre = styled.pre`
  span,
  code {
    font-family: 'Fira Code', 'Courier New', Courier, monospace;
  }
`
const ResultCode = styled.code`
  color: ${vars.black};
  font-size: 16px;
`

const SubmissionTable = ({ isLoading, results, canViewCode }) => {
  const { isAdmin } = useAuthContext()
  const showCode = canViewCode || isAdmin

  return (
    <CustomTable ready={!!results && !isLoading}>
      <thead>
        <RenderOnIntersect id='subs/head' initialHeight='50px'>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Problem</th>
            <th>Result</th>
            <th>Time</th>
            <th>Score</th>
            {showCode && <th>Code</th>}
          </tr>
        </RenderOnIntersect>
      </thead>
      <tbody>
        {results?.map((result, index) => (
          <SubTr key={index} {...result} canViewCode={showCode} />
        ))}
      </tbody>
    </CustomTable>
  )
}

const SubTr = memo((props) => {
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
      <RenderOnIntersect id={`subs/${idResult}`} initialHeight='63px'>
        <CustomTr acceptState={isAccept(result)}>
          <td>{idResult}</td>
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
                <ViewCodeButton {...{ idResult }} />
              </ButtonGroup>
            </td>
          )}
        </CustomTr>
      </RenderOnIntersect>

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
