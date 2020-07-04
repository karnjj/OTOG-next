import { useAuthContext } from './auth'
import useSWR from 'swr'

export const httpGet = async (url, token) => {
	const params = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: token ? `${token}` : '',
		},
	}
	const res = await fetch(`${process.env.API_URL}${url}`, params)
	return await res.json()
}

export const useGet = (url, instant = true, options) => {
	const { token } = useAuthContext()
	const { data, error, isValidating, mutate } = useSWR(
		instant ? [url, token] : null,
		httpGet,
		options
	)
	const isLoading = !data && !error
	return { data, error, isLoading, isFetching: isValidating, execute: mutate }
}
