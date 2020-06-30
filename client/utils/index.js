import { useState, useCallback } from 'react'

export const useInput = (initialValue = '', converter) => {
	const [value, setValue] = useState(initialValue)
	const convert = useCallback(converter ?? ((val) => val), [converter])
	const onChange = useCallback(
		(event) => setValue(convert(event.target.value)),
		[convert]
	)
	return [value, { value, onChange }, setValue]
}

export const useSwitch = (initialState = false) => {
	const [state, setState] = useState(initialState)
	const handleShow = useCallback(() => setState(true), [])
	const handleClose = useCallback(() => setState(false), [])
	return [state, handleShow, handleClose, setState]
}

export const range = (n) => [...Array(n).keys()]
