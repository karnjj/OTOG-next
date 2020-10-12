import { useAuthContext } from './auth'
import useSWR from 'swr'
import { useCallback } from 'react'

export const http = async (method, url, { token, body }, isJson = true) => {
  const params = {
    method,
    headers: {
      ...(isJson && { 'Content-Type': 'application/json' }),
      Authorization: token ? `Bearer ${token}` : '',
    },
    body,
  }
  return fetch(`${process.env.API_URL}${url}`, params)
}

export const httpGet = async (url, { token } = {}, isJson = true) => {
  const response = await http('GET', url, { token }, isJson)
  return response.json()
}
export const httpPost = async (url, { token, body } = {}, isJson = true) =>
  http('POST', url, { token, body }, isJson)

export const useGet = (url, options) => {
  const { token } = useAuthContext()
  const fetcher = useCallback((url) => httpGet(url, { token }), [token])
  const state = useSWR(url, fetcher, options)
  const { data, error } = state
  const isLoading = !data && !error
  return { ...state, isLoading }
}

export const useHttp = (method, url) => {
  const { token } = useAuthContext()
  return useCallback(
    (body, isJson = true) => http(method, url, { token, body }, isJson),
    [method, url, token]
  )
}
export const usePost = (url) => {
  return useHttp('POST', url)
}
