import { useState, useEffect, useRef, useCallback } from 'react'

import { Modal, Button } from 'react-bootstrap'
import OrangeButton from './OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import prism from 'prismjs'
import { useSwitch } from '../utils'
import { useGet } from '../utils/api'

const FontPre = styled.pre`
	span,
	code {
		font-family: 'Fira Code', monospace, 'Courier New', Courier;
	}
`

const ViewCodeButton = ({ idResult, id_Prob, mini }) => {
	const [show, handleShow, handleClose] = useSwitch(false)
	const shown = useRef(false)
	const onShow = useCallback(() => {
		shown.current = true
		handleShow()
	}, [])

	const url = idResult
		? `/api/scode?idSubmit=${idResult}`
		: `/api/scode?idProb=${id_Prob}`
	const { data = {}, isLoading } = useGet(shown.current && url)
	const { sCode: sourceCode } = data

	const [showLineNumber, setShowLineNumber] = useState(true)
	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth < 768) {
				if (showLineNumber) {
					setShowLineNumber(false)
					console.log('resize')
				}
			} else if (!showLineNumber) {
				setShowLineNumber(true)
				console.log('resize')
			}
		}
		onResize()
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [show, showLineNumber])

	useEffect(() => {
		if (!isLoading && show) {
			prism.highlightAll()
		}
	}, [show, showLineNumber, isLoading])

	return (
		<>
			{mini ? (
				<Button size='sm' variant='outline-link' onClick={onShow}>
					🔎
				</Button>
			) : (
				<OrangeButton expand={2} outline='true' onClick={onShow} icon='true'>
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
