import { useState } from 'react'
import { Modal, Form } from 'react-bootstrap'
import OrangeButton from './OrangeButton'

const Submit = ({ prob }) => {
    const { name } = prob
    const [ show, setShow ] = useState(false)
    const [ fileName, setFileName ] = useState('')
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const uploadFile = event => {
        setFileName(event.target.files[0].name)
    }
    const onUploadCheck = e => {
        let extension = fileName.split('.').pop().toLowerCase()
        if (!['c', 'cpp'].some(ext => extension === ext)) {
            e.preventDefault()
        }
    }
    return (
        <>
            <OrangeButton onClick={handleShow}>Submit</OrangeButton>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{name}</Modal.Title>
                </Modal.Header>
                <Form action='upload' method='post' encType='multipart/form-data' onSubmit={onUploadCheck}>
                    <Modal.Body>
                        <div className='custom-file'>
                            <input type='file' className='custom-file-input' onChange={uploadFile}/>
                            <label className='custom-file-label'>{fileName || 'Choose file'}</label>
                        </div><br/><br/>
                        <Form.Label>Choose Language</Form.Label>
                        <Form.Control as='select'>
                            <option>C++</option>
                            <option>C</option>
                        </Form.Control>
                    </Modal.Body>
                    <Modal.Footer>
                        <OrangeButton type='submit'>Submit</OrangeButton>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default Submit