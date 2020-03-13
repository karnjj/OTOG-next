import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/style.css"

export default function App({ children }) {
    return(
        <main>
            <Head>
                <title>OTOG</title>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/logoIOS.png"></link>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#ff851b"></meta>
                {/*<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"></link>*/}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            </Head>
            {children}
        </main>
    )
}