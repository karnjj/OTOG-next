import { useEffect, useContext, createContext } from 'react'
import Error from 'next/error'
import router, { useRouter } from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import jwt_decode from 'jwt-decode'
export const isLogin = token => {
	return !!token
}

export const login = token => {
	cookie.set('token', token, { expires: 3 / 24 })
	router.push('/')
}

export const auth = token => {
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
	return token ? jwt_decode(token) : {}
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
			<AuthProvider value={props.userData}>
				<TokenProvider value={props.token}>
					<WrappedComponent {...props} />
				</TokenProvider>
			</AuthProvider>
		)
	}
	Wrapper.getInitialProps = async ctx => {
		const componentProps =
			WrappedComponent.getInitialProps &&
			(await WrappedComponent.getInitialProps(ctx))
		const { token } = nextCookie(ctx)
		const userData = auth(token)
		return { ...componentProps, token, userData }
	}
	return Wrapper
}

export const AuthContext = createContext()
export const AuthProvider = props => <AuthContext.Provider {...props} />
export const useAuthContext = () => {
	return useContext(AuthContext)
}

export const TokenContext = createContext()
export const TokenProvider = props => <TokenContext.Provider {...props} />
export const useTokenContext = () => {
	return useContext(TokenContext)
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
	Wrapper.getInitialProps = async ctx => {
		const componentProps =
			WrappedComponent.getInitialProps &&
			(await WrappedComponent.getInitialProps(ctx))
		return { ...componentProps }
	}
	return withAuthSync(Wrapper)
}
