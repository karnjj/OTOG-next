import Head from 'next/head'
import nextCookie from 'next-cookies'
import { ThemeProvider } from 'styled-components'
import { isLogin, AuthProvider, auth } from '../utils/auth'

import breakpoints from '../styles/breakpoints'
import 'bootstrap/dist/css/bootstrap.min.css'

import Header from '../components/Header'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { createGlobalStyle } from 'styled-components'
import { down } from 'styled-breakpoints'
config.autoAddCss = false

const GlobalStyle = createGlobalStyle`
    body {
        overflow-y: scroll;
    }
    ${down('sm')} {    
        h1 {
            font-size: 1.9rem;
        }
        h2 {
            font-size: 1.6rem;
        }
        h3 {
            font-size: 1.3rem;
        }
        a.otogbtn,
        button.otogbtn {
            font-size: 0.9rem;
        }
        a, p, span,
        input::placeholder,
        label,
        td, th, code, pre {
            font-size: 0.85rem;
        }
        .language-c, .language-cpp{
            font-size: 0.85rem!important;
        }
    }
`

const MyApp = props => {
	const { Component, pageProps, userData } = props
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
				<AuthProvider value={userData}>
					<GlobalStyle />
					<Component {...pageProps} />
				</AuthProvider>
			</ThemeProvider>
		</>
	)
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const pageProps =
		Component.getInitialProps && (await Component.getInitialProps(ctx))
	const userData = await auth(ctx)
	return { pageProps, userData }
}

export default MyApp
