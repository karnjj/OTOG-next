import Head from 'next/head'
import { ThemeProvider } from 'styled-components'
import { unregister } from 'next-offline/runtime'

import { AuthProvider } from '../utils/auth'
import breakpoints from '../styles/breakpoints'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { createGlobalStyle } from 'styled-components'
import { useEffect } from 'react'
import vars from '../styles/vars'
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

const MyApp = ({ Component, pageProps }) => {
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
				<AuthProvider>
					<GlobalStyle />
					<Component {...pageProps} />
				</AuthProvider>
			</ThemeProvider>
		</>
	)
}

export default MyApp
