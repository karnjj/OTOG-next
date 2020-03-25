import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { withAuthSync, useAuthContext } from "../../utils/auth";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Timer from '../../components/Timer'
import { Button, ButtonToolbar, ButtonGroup, Table } from 'react-bootstrap'
import OrangeButton from '../../components/OrangeButton'
const Annoucement = () => {
    var timee = 1585218437;
    return (
        <div>
            <br></br>
            <Card>
                <Card.Header>Time left</Card.Header>
                <Card.Title>
                    <Container>
                        <Row>
                            <Col xs={2}></Col>
                            <Col>
                                <br></br>
                                <Timer CountTo={timee} />
                                <br></br>
                            </Col>
                        </Row>
                    </Container>
                </Card.Title>
            </Card>
            <br></br>
            <Card>
                <Card.Header>Annoucement</Card.Header>
                <Container>
                    <br></br>
                    <Card.Text>You can view help here!</Card.Text>
                    <br></br>
                </Container>
            </Card>

        </div>
    );
}

const Submission = props => {
    const router = useRouter()
    const { id } = router.query
    const userData = useAuthContext()
    const [best, setBest] = useState(null)
    const [lastest, setLastest] = useState(null)
    const [SC, setSC] = useState('test')
    var waitingData = 0
    useEffect(() => {
        const fetchData = async () => {
            const url = `${process.env.API_URL}/api/contest/submission/${id}`
            const response = await fetch(url, {
                headers: {
                    authorization: userData.id
                }
            })
            const json = await response.json()
            setBest(json.best_submit)
            setLastest(json.lastest_submit)
            sendData()
            if (lastest[0] !== undefined)
                if (lastest[0].status == 0)
                    waitingData = setInterval(fetchNewData, 1000);
        }
        fetchData()
    }, [])
    const sendData = () => {
        if (lastest[0] !== undefined) props.ParentCallback(lastest[0].score, best[0].idResult);
    }
    /*
    const HideSc = event => {
        this.setState({showSc : event})
    }
    const ShowBest = () => {
        this.setState({showSc : true, SC : this.state.best[0].scode})
    }
    const ShowLast = () => {
        this.setState({showSc : true, SC : this.state.lastest[0].scode })
    }*/
    const fetchNewData = async () => {
        const url = `${process.env.API_URL}/api/contest/submission/${id}`
        const response = await fetch(url, {
            headers: {
                authorization: userData.id
            }
        })
        const json = await response.json()
        setBest(json.best_submit)
        setLastest(json.lastest_submit)
        sendData()
        if (lastest[0].status == 1) clearInterval(waitingData);
    }
    //console.log('submit ' + this.state.best);
    var best_submission = [], last_submission = []
    for (var e in best) {
        var temp = best[e]
        best_submission.push(<tr key={e}>
            <td>Best 👍</td>
            <td>{temp.result}</td>
            <td>{temp.score}</td>
            <td>
                <Button size="sm" variant="outline-link" /*onClick={this.ShowBest.bind(this)}*/>🔎</Button>
            </td>
        </tr>)
    }
    for (var e in lastest) {
        var temp = lastest[e]
        last_submission.push(<tr key={e}>
            <td>Lastest</td>
            <td>{temp.result}</td>
            <td>{temp.score}</td>
            <td>
                <Button size="sm" variant="outline-link" /*onClick={this.ShowLast.bind(this)}*/>🔎</Button>
            </td>
        </tr>)
    }
    return (
        <>
            <br></br>
            <Table size="sm" bordered hover centered>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Result</th>
                        <th>Score</th>
                        <th>Code</th>
                    </tr>
                </thead>
                <tbody>
                    {last_submission}
                    {best_submission}
                </tbody>
            </Table>
        </>
    )
}

const Problem = props => {
    const userData = useAuthContext()
    const [selectedFile, setSelectedFile] = useState(undefined)
    const [fileName, setFileName] = useState('')
    const [fileLang, setFileLang] = useState('C++')
    const [solved, setSolved] = useState(false)
    const [idBest, setIdBest] = useState(-1)
    const selectFile = event => {
        if (event.target.files[0] !== undefined) {
            setSelectedFile(event.target.files[0])
            setFileName(event.target.files[0].name)
        } else {
            setSelectedFile(undefined)
            setFileName('')
        }
    }
    const uploadFile = async e => {
        e.preventDefault()
        if (selectedFile === undefined) return false
        const timeStamp = Math.floor(Date.now() / 1000)
        const data = new FormData()
        data.append('file', selectedFile)
        data.append('fileLang', fileLang)
        data.append('time', timeStamp)
        const url = `${process.env.API_URL}/api/upload/${id_Prob}`
        const respone = await fetch(url, {
            method: 'POST',
            headers: {
                authorization: userData.id
            },
            body: data
        })
        if (respone.ok) window.location.reload(false)
    }
    const quickResend = async () => {
        if (idBest != -1) {
            const url = `${process.env.API_URL}/api/contest/quickresend`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: idBest })
            })
            if (response.ok) window.location.reload(false)
        }
    }

    const CallbackFunc = (ChildData, id) => {
        if (ChildData == 100) setSolved(true)
        setIdBest(id)
    }
    return (
        <>
            <br></br>
            <br></br>
            <Card>
                <Card.Header as="h5">
                    Problem {props.index} {props.name + ' '}
                    {solved && <Badge variant="success">Solved</Badge>}
                    <p></p>
                    <Button variant="outline-info" size="sm" onClick={quickResend}>Quick Submit ⚡</Button>
                </Card.Header>
                <Row>
                    <Col>
                        <Card.Body>
                            <div className='custom-file'>
                                <input
                                    accept='.c,.cpp'
                                    type='file'
                                    className='custom-file-input'
                                    onChange={selectFile}
                                />
                                <label className='custom-file-label'>
                                    {fileName || 'Choose file'}
                                </label>
                            </div>
                            <br></br>
                            <br></br>
                            <Container>
                                <Row>
                                    <Col></Col>
                                    <Col xs={10}>
                                        <ButtonToolbar>
                                            <ButtonGroup className="mr-4">
                                                <OrangeButton type='submit' onClick={uploadFile}>
                                                    Submit
						                        </OrangeButton>
                                            </ButtonGroup>
                                            <ButtonGroup className="mr-4">
                                                <Button variant="secondary" >
                                                    View PDF
                                            </Button>
                                            </ButtonGroup>

                                        </ButtonToolbar>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </Container>

                        </Card.Body>
                    </Col>
                    <Col>
                        <Submission idProb={props.id_Prob} ParentCallback={CallbackFunc}/>
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            </Card>
        </>
    )
}

const Contest = () => {
    const router = useRouter()
    const { id } = router.query
    const userData = useAuthContext()
    const [taskState, setTaskState] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const url = `${process.env.API_URL}/api/contest/${id}`
            let headers = { 'Content-Type': 'application/json' }
            headers['Authorization'] = userData ? userData.id : ''
            const res = await fetch(url, { headers })
            const json = await res.json()
            setTaskState(json.problem)
        }
        fetchData()
    }, [])
    return (
        <>
            <Header />
            <Container>
                <Row>
                    <Col xs={9}>
                        <div>
                            {taskState.map((problem, index) => {
                                return <Problem key={index} {...problem} index={Number(index) + 1} />
                            })}
                        </div>
                    </Col>
                    <Col>
                        <br />
                        <Annoucement />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default withAuthSync(Contest);