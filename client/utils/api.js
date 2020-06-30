import { useEffect, useReducer, useRef, useCallback } from 'react'
import fetch from 'isomorphic-unfetch'
import { useAuthContext } from './auth'

const initialState = { data: null, isLoading: false, error: null }

const reducer = (state, action) => {
  // console.log(action.type)
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true }
    case 'success':
      return { ...state, data: action.json, isLoading: false }
    case 'error':
      return { ...state, error: action.error, isLoading: false }
    default:
      throw new Error()
  }
}

export const httpGet = async (url, token) => {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
  const res = await fetch(`${process.env.API_URL}${url}`, params)
  return await res.json()
}

export const useGet = (url, deps = [], auto = true) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { token } = useAuthContext()

  const cancelled = useRef(false)
  useEffect(() => {
    return () => (cancelled.current = true)
  }, [])

  const execute = useCallback(async () => {
    dispatch({ type: 'loading' })
    try {
      const json = await httpGet(url, token)
      if (!cancelled.current) {
        dispatch({ type: 'success', json })
      }
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }, [auto, url, ...deps])

  useEffect(() => {
    if (auto) {
      execute()
    }
  }, [auto, url, ...deps])

  return [state.data, state.isLoading, execute]
}
