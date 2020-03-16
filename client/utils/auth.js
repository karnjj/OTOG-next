import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'

export const isLogin = token => {
    if(token) return true
    else false
}

export const login = (token) => {
    cookie.set('token', token, { expires: 1 })
    Router.push('/')
}

export const auth = async ctx => {
    const { token } = nextCookie(ctx)
    let url = `${process.env.API_URL}/api/auth`
    let headers = { "Content-Type": "application/json" }
    if (token) {
        headers["Authorization"] = token;
        const response = await fetch(url, { headers, })
        if (!response.ok) {
            cookie.remove('token')
            window.localStorage.setItem('logout', Date.now())
            Router.push('/login')
        }
        return response.json()
    }
}

export const logout = () => {
    cookie.remove('token')
    window.localStorage.setItem('logout', Date.now())
    window.location.reload(false)
}

export const withAuthSync = WrappedComponent => {
    const Wrapper = props => {
        const syncLogout = event => {
            if (event.key === 'logout') {
                console.log('logged out from storage!')
                Router.push('/login')
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

    Wrapper.getInitialProps = async ctx => {
        const jsData = await auth(ctx)
        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx))
        //console.log(jsData);
        return { ...componentProps, jsData }
    }
    return Wrapper
}
