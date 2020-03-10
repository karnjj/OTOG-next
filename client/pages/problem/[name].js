import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import App from '../../components/App';
const openPDF = props => {
    const router = useRouter()
    const { name } = router.query
    const url = 'http://localhost:8000/api/docs/'+name
    return (
        <App>
            <iframe src={url} type="application/pdf" >   </iframe>
            <style jsx>{`
                iframe {
                    display: block;
                    background: #000;
                    border: none; 
                    height: 100vh;
                    width: 100vw;
                }
                `}</style>
        </App>
    )
}
export default openPDF