import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider } from 'styled-components'
import breakpoints from '../styles/breakpoints'
import '../styles/style.css'

export default function App({ children }) {
    return(
        <main>
            <Head>
                <title>OTOG</title>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/logoIOS.png"></link>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#ff851b"></meta>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            </Head>
            <ThemeProvider theme={{breakpoints}}>
                {children}
            </ThemeProvider>
        </main>
    )
}