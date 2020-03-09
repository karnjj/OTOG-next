import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import styled from 'styled-components'

const OrangeButton = styled(Button)`
    color: white;
    border-color: #FF851B;
    background-color: #FF851B;
`
const SubmitModal = ({ show, handleClose, problem }) => {
    const { id_Prob, name } = problem
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>eiei</Modal.Body>
            <Modal.Footer>
                <OrangeButton onClick={handleClose}>Submit</OrangeButton>
            </Modal.Footer>
        </Modal>
    )
}

const Submit = ({ prob }) => {
    const [ show, setShow ] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    return (
        <>
            <OrangeButton onClick={handleShow}>Submit</OrangeButton>
            <SubmitModal show={show} handleClose={handleClose} problem={prob}></SubmitModal>
        </>
    )
}

export default Submit