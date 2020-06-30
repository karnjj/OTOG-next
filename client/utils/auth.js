import {
	useEffect,
	useContext,
	createContext,
	useMemo,
	useCallback,
} from 'react'
import Error from 'next/error'
import router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import jwt_decode from 'jwt-decode'

export const login = (token) => {
	cookie.set('token', token, { expires: 3 / 24 })
	router.push('/')
}

export const auth = (token) => {
	return token && jwt_decode(token)
}

export const logout = (userData) => {
	let url = `${process.env.API_URL}/api/logout`
	let headers = { 'Content-Type': 'application/json' }
	headers['Authorization'] = userData.id
	fetch(url, { headers })
	cookie.remove('token')
	window.localStorage.setItem('logout', Date.now())
	window.location.reload(false)
}

export const withAuthSync = (WrappedComponent) => {
	const Wrapper = ({ token, ...componentProps }) => {
		const syncLogout = (event) => {
			if (event.key === 'logout') {
				window.location.reload(false)
			}
		}

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

		return (
			<AuthProvider value={value}>
				<WrappedComponent {...componentProps} />
			</AuthProvider>
		)
	}

	Wrapper.getInitialProps = async (ctx) => {
		const componentProps =
			WrappedComponent.getInitialProps &&
			(await WrappedComponent.getInitialProps(ctx))
		const { token } = nextCookie(ctx)
		return { ...componentProps, token }
	}

	return Wrapper
}

export const AuthContext = createContext()
export const AuthProvider = (props) => <AuthContext.Provider {...props} />
export const useAuthContext = () => useContext(AuthContext)

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
	return withAuthSync(Wrapper)
}
