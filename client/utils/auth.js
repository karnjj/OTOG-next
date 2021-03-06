import {
  useEffect,
  useContext,
  createContext,
  useCallback,
  useState,
} from 'react'
import Error from 'next/error'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import jwt_decode from 'jwt-decode'
import { http } from './api'

export const auth = (token) => {
  return token && jwt_decode(token)
}

export const AuthContext = createContext()
export const useAuthContext = () => useContext(AuthContext)
export const AuthProvider = ({ reqToken, ...rest }) => {
  const [token, setToken] = useState(() => cookie.get('token') || reqToken)

  const login = useCallback(
    (token) => {
      cookie.set('token', token, { expires: 3 / 24 })
      setToken(token)
      window.localStorage.setItem('login', Date.now())
    },
    [token]
  )

  const logout = useCallback(async () => {
    const response = await http('GET', '/api/logout', { token })
    if (response.ok) {
      cookie.remove('token')
      setToken(null)
      window.localStorage.setItem('logout', Date.now())
    }
  }, [token])

  const syncSession = useCallback(({ key }) => {
    if (key === 'login' || key === 'logout') {
      setToken(cookie.get('token'))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('storage', syncSession)
    return () => {
      window.removeEventListener('storage', syncSession)
      window.localStorage.removeItem('logout')
      window.localStorage.removeItem('login')
    }
  }, [])

  const userData = auth(token)
  const isLogin = !!token
  const isAdmin = userData?.state === 0
  const value = { token, userData, isLogin, isAdmin, login, logout }

  return <AuthContext.Provider value={value} {...rest} />
}

export const withAdminAuth = (WrappedComponent) => {
  const Wrapper = ({ token: nextToken, ...props }) => {
    const { token: authToken } = useAuthContext()
    const [token, setToken] = useState(nextToken)
    useEffect(() => setToken(authToken), [authToken])

    const userData = auth(token)
    return userData?.state === 0 ? (
      <WrappedComponent {...props} />
    ) : (
      <Error statusCode={404} />
    )
  }
  return Wrapper
}

export function getCookieContext(context) {
  const { token } = nextCookie(context)
  return token ?? null
}

export async function getServerSideProps(context) {
  const token = getCookieContext(context)
  return { props: { token } }
}
