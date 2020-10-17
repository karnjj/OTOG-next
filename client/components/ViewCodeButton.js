import { useState, useEffect, useRef } from 'react'

import { Modal, Button } from 'react-bootstrap'
import OrangeButton from './OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'

import styled from 'styled-components'
import prism from 'prismjs'
import { useShow } from '../utils'
import { useGet } from '../utils/api'

const FontPre = styled.pre`
  &&,
  span,
  code {
    font-family: 'Fira Code', monospace, 'Courier New', Courier;
  }
`

const ViewCodeButton = ({ idResult, id_Prob, mini }) => {
  const [show, handleShow, handleClose, shown] = useShow(false)

  const url = idResult
    ? `/api/scode?idSubmit=${idResult}`
    : `/api/scode?idProb=${id_Prob}`
  const {
    data: { sCode: sourceCode },
    isLoading,
  } = useGet(shown && url)

  const [showLineNumber, setShowLineNumber] = useState(true)

  const codeRef = useRef(null)

  useEffect(() => {
    const onResize = () => {
      if (show) {
        setShowLineNumber(window.innerWidth >= 768)
      }
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [show])

  useEffect(() => {
    if (!isLoading && show) {
      prism.highlightElement(codeRef.current)
    }
  }, [show, showLineNumber, isLoading, codeRef])

  return (
    <>
      {mini ? (
        <Button size='sm' variant='outline-link' onClick={handleShow}>
          🔎
        </Button>
      ) : (
        <OrangeButton
          expand={2}
          variant='outline-primary'
          onClick={handleShow}
          icon='true'
        >
          <FontAwesomeIcon icon={faCode} />
        </OrangeButton>
      )}

      <Modal show={show && !isLoading} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Submission : {idResult}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FontPre className={showLineNumber && 'line-numbers'}>
            <code className={`language-cpp`} ref={codeRef}>
              {sourceCode}
            </code>
          </FontPre>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ViewCodeButton
