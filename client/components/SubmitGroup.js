import { useState } from 'react'
import router from 'next/router'

import { Modal, Form, ButtonGroup } from 'react-bootstrap'
import OrangeButton from './OrangeButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { usePost } from '../utils/api'
import { useShow } from '../utils'

const SubmitGroup = ({ name, id_Prob, children }) => {
  const [show, handleShow, handleClose] = useShow(false)
  const [fileLang, setFileLang] = useState('C++')
  const [file, setFile] = useState()

  const selectLang = (event) => setFileLang(event.target.value)
  const selectFile = (event) => setFile(event.target.files[0])

  const post = usePost(`/api/upload/${id_Prob}`)
  const uploadFile = async (e) => {
    e.preventDefault()
    if (!file) return
    const body = new FormData()
    body.append('file', file)
    body.append('fileLang', fileLang)
    const response = await post(body, false)
    if (response.ok) {
      router.pathname === '/submission'
        ? window.location.reload(false)
        : router.push('/submission')
    }
  }

  return (
    <>
      <ButtonGroup>
        <OrangeButton expand={6} onClick={handleShow}>
          <FontAwesomeIcon icon={faFileUpload} />
        </OrangeButton>
        {children}
      </ButtonGroup>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Form as={Modal.Body}>
          <Form.Group>
            <Form.File
              label={file?.name ?? 'Choose file'}
              accept='.c,.cpp'
              onChange={selectFile}
              custom
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Choose Language</Form.Label>
            <Form.Control as='select' onChange={selectLang}>
              <option>C++</option>
              <option>C</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <Modal.Footer>
          <OrangeButton type='submit' onClick={uploadFile}>
            Submit
          </OrangeButton>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SubmitGroup
