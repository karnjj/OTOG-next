import { getCookieContext, useAuthContext } from './auth'
import useSWR, { mutate } from 'swr'
import { useCallback } from 'react'

export const http = async (
  method,
  url,
  { token, body } = {},
  isJson = true
) => {
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

export const getAndCache = async (...args) => {
  const data = httpGet(...args)
  return mutate(args[0], data, false)
}

export const prefetch = async (context, url) => {
  const token = getCookieContext(context)
  const data = await getAndCache(url, { token })
  return { data, token }
}

export const httpPost = async (...args) => http('POST', ...args)

export const useGet = (url, options) => {
  const { token } = useAuthContext()
  const fetcher = useCallback((url) => httpGet(url, { token }), [token])
  const state = useSWR(url, fetcher, options)
  const { data, error } = state
  const isLoading = !data && !error
  return { ...state, data: data ?? {}, isLoading }
}

export const useHttp = (method, url) => {
  const { token } = useAuthContext()
  return useCallback(
    (body, isJson = true) => http(method, url, { token, body }, isJson),
    [method, url, token]
  )
}

export const httpGet = async (...args) => {
  const response = await http('GET', ...args)
  return response.json()
}

export const usePost = (url) => {
  return useHttp('POST', url)
}

export const usePatch = (url) => {
  return useHttp('PATCH', url)
}

export const usePut = (url) => {
  return useHttp('PUT', url)
}

export const useDelete = (url) => {
  return useHttp('DELETE', url)
}
