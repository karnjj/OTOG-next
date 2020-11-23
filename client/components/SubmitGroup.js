import { useState } from 'react'
import CustomAlert from './CustomAlert'
import OrangeButton from './OrangeButton'
import { Modal, Form, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'

import { usePost } from '../utils/api'
import { useAlert, useForm, useShow } from '../utils'

const SubmitGroup = ({ name, id_Prob, children, callback }) => {
  const [show, handleShow, handleClose] = useShow(false)
  const [loading, setLoading] = useState(false)
  const { data, onFileChange, onValueChange } = useForm({ fileLang: 'C++' })
  const { file, fileLang } = data

  const post = usePost(`/api/upload/${id_Prob}`)
  const [alert, setAlert] = useAlert()
  const uploadFile = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    alert.handleClose()
    try {
      const body = new FormData()
      Object.keys(data).forEach((item) => body.append(item, data[item]))
      const response = await post(body, false)
      if (response.ok) {
        if (callback) {
          callback()
        }
        handleClose()
      } else {
        setAlert({ head: res.status, desc: res.statusText })
      }
    } catch (error) {
      setAlert({ head: error.name, desc: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CustomAlert {...alert} />
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
              name='file'
              label={file?.name ?? 'Choose file'}
              accept='.c,.cpp'
              onChange={onFileChange}
              custom
              onClick={(event) => {
                event.target.value = null
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Choose Language</Form.Label>
            <Form.Control as='select' value={fileLang} onChange={onValueChange}>
              <option>C++</option>
              <option>C</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <Modal.Footer>
          <OrangeButton type='submit' onClick={uploadFile} disabled={loading}>
            {loading ? 'Submitting' : 'Submit'}
          </OrangeButton>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SubmitGroup
