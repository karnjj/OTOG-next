import { useEffect, useContext, createContext } from 'react'
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

export const auth = async (token) => {
	/*
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
	}*/
	return token && jwt_decode(token)
}

export const logout = (userData) => {
	let url = `${process.env.API_URL}/api/logout`
	let headers = { 'Content-Type': 'application/json' }
	headers['Authorization'] = userData.id
	const res = fetch(url, { headers })
	cookie.remove('token')
	window.localStorage.setItem('logout', Date.now())
	window.location.reload(false)
}

export const withAuthSync = (WrappedComponent) => {
	const Wrapper = ({ authData, ...props }) => {
		const syncLogout = (event) => {
			if (event.key === 'logout') {
				console.log('logged out from storage!')
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
		return (
			<AuthProvider value={authData}>
				<WrappedComponent {...props} />
			</AuthProvider>
		)
	}

	Wrapper.getInitialProps = async (ctx) => {
		const componentProps =
			WrappedComponent.getInitialProps &&
			(await WrappedComponent.getInitialProps(ctx))
		const { token } = nextCookie(ctx)
		const userData = await auth(token)
		const isLogin = !!token
		const isAdmin = userData?.state === 0
		const authData = { token, userData, isLogin, isAdmin }
		return { ...componentProps, authData }
	}
	return Wrapper
}

export const AuthContext = createContext()
export const AuthProvider = (props) => <AuthContext.Provider {...props} />
export const useAuthContext = () => {
	return useContext(AuthContext)
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
	return withAuthSync(Wrapper)
}
