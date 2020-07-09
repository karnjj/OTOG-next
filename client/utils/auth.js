import {
	useEffect,
	useContext,
	createContext,
	useCallback,
	useState,
} from 'react'
import Error from 'next/error'
import router from 'next/router'
import cookie from 'js-cookie'
import jwt_decode from 'jwt-decode'
import { http } from './api'

export const auth = (token) => {
	return token && jwt_decode(token)
}

export const AuthContext = createContext()
export const useAuthContext = () => useContext(AuthContext)
export const AuthProvider = (props) => {
	const [token, setToken] = useState(() => cookie.get('token'))
	const syncLogout = useCallback((event) => {
		if (event.key === 'logout') {
			window.location.reload(false)
		}
	}, [])

	useEffect(() => {
		window.addEventListener('storage', syncLogout)
		return () => {
			window.removeEventListener('storage', syncLogout)
			window.localStorage.removeItem('logout')
		}
	}, [])

	const login = useCallback(
		(accessToken) => {
			cookie.set('token', accessToken, { expires: 3 / 24 })
			setToken(accessToken)
			router.push('/')
		},
		[token]
	)

	const logout = useCallback(() => {
		http('GET', '/api/logout', { token })
		cookie.remove('token')
		setToken(null)
		window.localStorage.setItem('logout', Date.now())
	}, [token])

	const userData = auth(token)
	const isLogin = !!token
	const isAdmin = userData?.state === 0
	const value = { token, userData, isLogin, isAdmin, login, logout }

	return <AuthContext.Provider value={value} {...props} />
}

export const withAdminAuth = (WrappedComponent) => {
	const Wrapper = (props) => {
		const { isAdmin } = useAuthContext()
		return isAdmin ? (
			<WrappedComponent {...props} />
		) : (
			<Error statusCode={404} />
		)
	}
	Wrapper.getInitialProps = async (ctx) => {
		const componentProps =
			WrappedComponent.getInitialProps &&
			(await WrappedComponent.getInitialProps(ctx))
		return { ...componentProps }
	}
	return Wrapper
}
