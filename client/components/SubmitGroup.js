import { useState } from 'react'
import { useAuthContext } from '../utils/auth'
import fetch from 'isomorphic-unfetch'
import router from 'next/router'

import { Modal, Form, ButtonGroup } from 'react-bootstrap'
import OrangeButton from './OrangeButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { route } from 'next/dist/next-server/server/router'

const SubmitGroup = props => {
	const { name, id_Prob, children } = props
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
		const data = new FormData()
		data.append('file', selectedFile)
		data.append('fileLang', fileLang)
		const url = `${process.env.API_URL}/api/upload/${id_Prob}`
		const respone = await fetch(url, {
			method: 'POST',
			headers: {
				authorization: userData.id
			},
			body: data
		})
		if (respone.ok) (router.pathname === '/submission') ? window.location.reload(false) : router.push('/submission')
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
							label={fileName || 'Choose file'}
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
