import ReactDOM from 'react-dom'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { withAuthSync } from '../../utils/auth'

import { Navbar, Nav  } from 'react-bootstrap'
import Submit from '../../components/Submit'

import styled from 'styled-components'

const StyledNavbar = styled(Navbar)`
    top: ${props => props.hide ? '-56px' : 0};
    transition: top 0.2s;
`
const Iframe = styled.iframe`
    display: block;
    background: #000;
    border: none; 
    height: 100vh;
    width: 100vw;
`

const PDFReader = (props) => {
    const { url } = props
    const [scroll, setScroll] = useState(0)
    const [contentRef, setContentRef] = useState(null)
    console.log(contentRef)
    console.log(contentRef && contentRef.contentWindow)
    //console.log(obj.contentWindow.document.body.scrollHeight)
    return (
        <Iframe id='pdfreader' src={url} ref={setContentRef} type='application/pdf'/>
    )
}

const OpenPDF = (props) => {
    const router = useRouter()
    const { name } = router.query
    const url = `${process.env.API_URL}/api/docs/${name}`

    const [hidden, setHidden] = useState('true')

    return (
        <>
            <StyledNavbar fixed='top' expand='sm' bg='dark' variant='dark' hide={hidden}>
                <Navbar.Brand>{name}</Navbar.Brand>
                <Nav className='mr-auto'></Nav>
                <Nav className='mr-auto'><h4>PPPPPPPPPPP</h4></Nav>
                <Nav className='justify-content-end'>
                    <Submit prob={{name}}/>
                </Nav>
            </StyledNavbar>
            <PDFReader {...{url}}/>
        </>
    )
}
export default withAuthSync(OpenPDF)