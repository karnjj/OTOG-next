import { useState } from 'react'
import { useAuthContext } from '../utils/auth'
import fetch from 'isomorphic-unfetch'

import { Modal, Form, ButtonGroup } from 'react-bootstrap'
import OrangeButton from './OrangeButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'

const SubmitGroup = props => {
	const { name, id_Prob, acceptState, wrongState, children } = props
	const userData = useAuthContext()

	const [show, setShow] = useState(false)
	const [fileName, setFileName] = useState('')
	const [fileLang, setFileLang] = useState('C++')
	const [selectedFile, setSelectedFile] = useState(undefined)

	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)
	const selectLang = event => setFileLang(event.target.value)

	const selectFile = event => {
		if (event.target.files[0] !== undefined) {
			setSelectedFile(event.target.files[0])
			setFileName(event.target.files[0].name)
		} else {
			setSelectedFile(undefined)
			setFileName('')
		}
	}
	const uploadFile = async e => {
		e.preventDefault()
		if (selectedFile === undefined) return false
		const timeStamp = Math.floor(Date.now() / 1000)
		const data = new FormData()
		data.append('file', selectedFile)
		data.append('fileLang', fileLang)
		data.append('time', timeStamp)
		const url = `${process.env.API_URL}/api/upload/${id_Prob}`
		const respone = await fetch(url, {
			method: 'POST',
			headers: {
				authorization: userData.id
			},
			body: data
		})
		if (respone.ok) window.location.reload(false)
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
				<Form>
					<Modal.Body>
						<div className='custom-file'>
							<input
								accept='.c,.cpp'
								type='file'
								className='custom-file-input'
								onChange={selectFile}
							/>
							<label className='custom-file-label'>
								{fileName || 'Choose file'}
							</label>
						</div>
						<br />
						<br />
						<Form.Label>Choose Language</Form.Label>
						<Form.Control as='select' onChange={selectLang}>
							<option>C++</option>
							<option>C</option>
						</Form.Control>
					</Modal.Body>
					<Modal.Footer>
						<OrangeButton type='submit' onClick={uploadFile}>
							Submit
						</OrangeButton>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	)
}

export default SubmitGroup
