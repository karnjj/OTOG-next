import Head from 'next/head'
import { ThemeProvider } from 'styled-components'
import { unregister } from 'next-offline/runtime'

import nextCookie from 'next-cookies'
import breakpoints from '../styles/breakpoints'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { createGlobalStyle } from 'styled-components'
import { useEffect } from 'react'
import vars from '../styles/vars'
import { AuthProvider } from '../utils/auth'
import App from 'next/app'
config.autoAddCss = false

const GlobalStyle = createGlobalStyle`
    body {
        overflow-y: scroll;
    }
    ::selection {
        color: ${vars.white};
        background: ${vars.orange};
    }
`

const MyApp = ({ Component, pageProps, token }) => {
	useEffect(() => unregister(), [])

	return (
		<>
			<Head>
				<title>OTOG - One Tambon One Grader</title>
				<link rel='manifest' href='/manifest.json' />
				<link rel='shortcut icon' href='/logo196.png' />
				<link rel='apple-touch-icon' href='/logoIOS.png' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link
					href='https://fonts.googleapis.com/css?family=Fira+Code&display=swap'
					rel='stylesheet'
				/>
				<meta name='theme-color' content='#ff851b' />
			</Head>
			<ThemeProvider theme={{ breakpoints }}>
				<AuthProvider token={token}>
					<GlobalStyle />
					<Component {...pageProps} />
				</AuthProvider>
			</ThemeProvider>
		</>
	)
}

MyApp.getInitialProps = async (ctx) => {
	const { token } = nextCookie(ctx)
	const appProps = await App.getInitialProps(ctx)
	return { token, ...appProps }
}

export default MyApp
