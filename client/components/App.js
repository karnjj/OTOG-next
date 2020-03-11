<<<<<<< HEAD
||||||| merged common ancestors
import "../style.css"
=======
import "../style.css"
import 'bootstrap/dist/css/bootstrap.min.css'
>>>>>>> aaea72b19b3e2568337282c9bfc6c2632cc49d7e
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/style.css"

export default function App({ children }) {
    return(
        <main>
            <Head>
                {/*<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"></link>*/}
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            </Head>
            {children}
        </main>
    )
}