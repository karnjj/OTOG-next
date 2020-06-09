import { useEffect, useReducer, useRef } from 'react'
import fetch from 'isomorphic-unfetch'

const initialState = { data: null, isLoading: false, error: null }

const reducer = (state, action) => {
	// console.log(action.type)
	switch (action.type) {
		case 'loading':
			return { ...state, data: null, isLoading: true }
		case 'success':
			return { ...state, data: action.json, isLoading: false }
		case 'error':
			return { ...state, error: action.error, isLoading: false }
		default:
			throw new Error()
	}
}

export const useGet = (url, auth = '', deps = []) => {
	const [state, dispatch] = useReducer(reducer, initialState)
	const cancelled = useRef(false)

	useEffect(() => {
		return () => {
			cancelled.current = true
		}
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'loading' })
			try {
				const params = {
					headers: { 'Content-Type': 'application/json', Authorization: auth },
				}
				const res = await fetch(`${process.env.API_URL}${url}`, params)
				const json = await res.json()
				if (!cancelled.current) {
					dispatch({ type: 'success', json })
				}
			} catch (error) {
				dispatch({ type: 'error', error })
			}
		}
		fetchData()
	}, deps)
	return [state.data, state.isLoading]
}
