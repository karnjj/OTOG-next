import { useEffect, useContext, createContext } from 'react'
import Error from 'next/error'
import router, { useRouter } from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'

export const isLogin = token => {
	return !!token
}

export const login = token => {
	cookie.set('token', token, { expires: 3 / 24 })
	router.push('/')
}

export const auth = async ctx => {
	const { token } = nextCookie(ctx)
	let url = `${process.env.API_URL}/api/auth`
	let headers = { 'Content-Type': 'application/json' }
	if (token) {
		headers['Authorization'] = token
		const response = await fetch(url, { headers })
		if (!response.ok) {
			cookie.remove('token')
			window.localStorage.setItem('logout', Date.now())
			router.push('/login')
		}
		return response.json()
	}
}

export const logout = userData => {
	let url = `${process.env.API_URL}/api/logout`
	let headers = { 'Content-Type': 'application/json' }
	headers['Authorization'] = userData.id
	const res = fetch(url, { headers })
	cookie.remove('token')
	window.localStorage.setItem('logout', Date.now())
	window.location.reload(false)
}

export const withAuthSync = WrappedComponent => {
	const Wrapper = props => {
		const syncLogout = event => {
			if (event.key === 'logout') {
				console.log('logged out from storage!')
				router.push('/login')
			}
		}
		useEffect(() => {
			window.addEventListener('storage', syncLogout)
			return () => {
				window.removeEventListener('storage', syncLogout)
				window.localStorage.removeItem('logout')
			}
		}, [])

		return <WrappedComponent {...props} />
	}
	return Wrapper
}

export const AuthContext = createContext()
export const AuthProvider = props => <AuthContext.Provider {...props} />
export const useAuthContext = () => {
	return useContext(AuthContext)
}
export const isAdmin = userData => userData && userData.state === 0

export const withAdminAuth = WrappedComponent => {
	const Wrapper = props => {
		const userData = useAuthContext()
		return isAdmin(userData) ? (
			<WrappedComponent {...props} />
		) : (
			<Error statusCode={404} />
		)
	}
	return withAuthSync(Wrapper)
}
