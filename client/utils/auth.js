import {
	useEffect,
	useContext,
	createContext,
	useMemo,
	useCallback,
} from 'react'
import Error from 'next/error'
import router from 'next/router'
import cookie from 'js-cookie'
import jwt_decode from 'jwt-decode'
import { http } from './api'

export const login = (token) => {
	cookie.set('token', token, { expires: 3 / 24 })
	router.push('/')
}

export const auth = (token) => {
	return token && jwt_decode(token)
}

export const logout = (token) => {
	http('GET', '/api/logout', { token })
	cookie.remove('token')
	window.localStorage.setItem('logout', Date.now())
	window.location.reload(false)
}

export const AuthContext = createContext()
export const useAuthContext = () => useContext(AuthContext)
export const AuthProvider = ({ token, ...props }) => {
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

	const userData = auth(token)
	const isLogin = !!token
	const isAdmin = userData?.state === 0
	const value = { token, userData, isLogin, isAdmin }

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
