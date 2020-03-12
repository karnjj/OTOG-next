import { useState } from 'react'
import { Modal, Form } from 'react-bootstrap'
import OrangeButton from './OrangeButton'

const Submit = (props) => {
    const { name } = props
    const [ show, setShow ] = useState(false)
    const [ fileName, setFileName ] = useState('')
    const [ selectedFile, setSelectedFile] = useState(undefined)

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const uploadFile = event => {
        if (event.target.files[0] !== undefined) {
            setSelectedFile(event.target.files[0])
            setFileName(event.target.files[0].name)
        } else {
            setSelectedFile(undefined)
            setFileName('')
        }
    }

    return (
        <>
            <OrangeButton onClick={handleShow}>Submit</OrangeButton>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{name}</Modal.Title>
                </Modal.Header>
                <Form action='upload' method='post'>
                    <Modal.Body>
                        <div className='custom-file'>
                            <input accept='.c,.cpp' type='file' className='custom-file-input' onChange={uploadFile}/>
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