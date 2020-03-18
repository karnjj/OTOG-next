import { useRouter } from 'next/router'
import styled from 'styled-components'

const Iframe = styled.embed`
    display: block;
    background: #000;
    border: none; 
    height: 100vh;
    width: 100vw;
`

const PDFViewer = () => {    
    const router = useRouter()
    const { name } = router.query
    const url = `${process.env.API_URL}/api/docs/${name}`

    return <Iframe src={url} type='application/pdf'/>
}

export default PDFViewer