import { useRouter } from 'next/router'
import { withAuthSync } from '../../utils/auth'

import { Navbar, Nav  } from 'react-bootstrap'
import Submit from '../../components/Submit'

import styled from 'styled-components'

const Iframe = styled.iframe`
    display: block;
    background: #000;
    border: none; 
    height: 100vh;
    width: 100vw;
`

const OpenPDF = (props) => {
    const router = useRouter()
    const { name } = router.query
    const url = `${process.env.API_URL}/api/docs/${name}`

    return (
        <>
            <Navbar fixed='top'>
                <div className='mr-auto'></div>
                <Nav>
                    <Submit prob={{name}}/>
                </Nav>
            </Navbar>
            <Iframe id='pdfreader' src={url} type='application/pdf'/>
        </>
    )
}
export default withAuthSync(OpenPDF)