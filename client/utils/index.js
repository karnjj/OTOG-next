import { useState, useCallback, useRef } from 'react'

export const useInput = (initialValue = '', converter) => {
	const [value, setValue] = useState(initialValue)
	const convert = useCallback(converter ?? ((val) => val), [converter])
	const onChange = useCallback(
		(event) => setValue(convert(event.target.value)),
		[convert]
	)
	return [value, { value, onChange }, setValue]
}

export const useShow = (initialState = false) => {
	const [show, setShow] = useState(initialState)
	const handleShow = useCallback(() => setShow(true), [])
	const handleClose = useCallback(() => setShow(false), [])
	const shown = useRef(initialState)
	if (show && !shown.current) {
		shown.current = true
	}
	return [show, handleShow, handleClose, shown.current]
}

export const range = (n) => [...Array(n).keys()]
