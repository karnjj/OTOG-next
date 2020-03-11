import { useRouter } from 'next/router'
import App from '../../components/App';
import { Navbar, Nav  } from 'react-bootstrap';
import { withAuthSync } from '../../utils/auth';
import Submit from '../../components/Submit';
const openPDF = props => {
    const router = useRouter()
    const { name } = router.query
    const url = 'http://localhost:8000/api/docs/' + name
    return (
        <App>
            <Navbar fixed="top" expand="sm" bg="dark" variant="dark">
                <Navbar.Brand>{name}</Navbar.Brand>
                <Nav className="mr-auto" ></Nav>
                <Nav className="mr-auto" ><code><h4>PPPPPPPPPPP</h4></code></Nav>
                <Nav className="justify-content-end">
                    <Submit prob={{name}} />
                </Nav>
            </Navbar>
            <iframe src={url} type="application/pdf" />
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
export default withAuthSync(openPDF)