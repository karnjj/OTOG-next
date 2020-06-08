import { useState, useEffect } from 'react'

import { Modal, Button } from 'react-bootstrap'
import OrangeButton from './OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import prism from 'prismjs'
import { useAuthContext, useTokenContext } from '../utils/auth'

const FontPre = styled.pre`
	span,
	code {
		font-family: 'Fira Code', monospace, 'Courier New', Courier;
	}
`

const ViewCodeButton = (props) => {
	const { idResult, id_Prob, mini } = props
	const userData = useAuthContext()
	const token = useTokenContext()
	const [show, setShow] = useState(false)
	const [sourceCode, setSourceCode] = useState('')
	const [showLineNumber, setShowLineNumber] = useState(true)

	const handleClose = () => setShow(false)
	const handleShow = async () => {
		let url = idResult
			? `${process.env.API_URL}/api/scode?idSubmit=${idResult}`
			: `${process.env.API_URL}/api/scode?idProb=${id_Prob}`
		let headers = { 'Content-Type': 'application/json' }
		headers['authorization'] = token ? token : ''
		const response = await fetch(url, { headers })
		const data = await response.json()
		setSourceCode(data.sCode)
		setShow(true)
	}

	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth < 768) {
				if (showLineNumber) {
					setShowLineNumber(false)
				}
			} else if (!showLineNumber) {
				setShowLineNumber(true)
			}
		}
		onResize()
		window.addEventListener('resize', onResize)
		if (show) {
			prism.highlightAll()
		}
		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [show, showLineNumber])

	return (
		<>
			{mini ? (
				<Button size='sm' variant='outline-link' onClick={handleShow}>
					🔎
				</Button>
			) : (
				<OrangeButton
					expand={2}
					outline='true'
					onClick={handleShow}
					icon='true'
				>
					<FontAwesomeIcon icon={faCode} />
				</OrangeButton>
			)}

			<Modal show={show} onHide={handleClose} centered size='lg'>
				<Modal.Header closeButton>
					<Modal.Title>Submission : {idResult}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FontPre className={showLineNumber && 'line-numbers'}>
						<code className={`language-cpp`}>{sourceCode}</code>
					</FontPre>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default ViewCodeButton
