import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import nextCookie from 'next-cookies'
import { ThemeProvider } from 'styled-components'
import { isLogin } from '../utils/auth'

import breakpoints from '../styles/breakpoints'
import 'bootstrap/dist/css/bootstrap.min.css'

import Header from '../components/Header'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false 

export default class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {}
        const { token } = nextCookie(ctx)
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return { pageProps,token }
    }
    render() {
        const { Component, pageProps, token } = this.props
        return (
            <>
                <Head>
                    <title>OTOG</title>
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="apple-touch-icon" href="/logoIOS.png"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link href="https://fonts.googleapis.com/css?family=Fira+Code&display=swap" rel="stylesheet"/>
                    <meta name="theme-color" content="#ff851b"/>
                </Head>
                <ThemeProvider theme={{breakpoints}}>
                    <Header login={isLogin(token)}/>
                    <Component {...pageProps} />
                </ThemeProvider>
            </>
        )
    }
}