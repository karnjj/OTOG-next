import { useState, useEffect } from 'react'
import { withAuthSync, useAuthContext } from '../../utils/auth'

import {
	Container,
	Row,
	Jumbotron,
	Card,
	Accordion,
	Col,
	Form,
	ButtonToolbar,
	Button,
	ButtonGroup,
	Table,
	Badge,
	useAccordionToggle
} from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faTrophy,
	faChevronDown,
	faChevronUp
} from '@fortawesome/free-solid-svg-icons'

import Title from '../../components/Title'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Timer from '../../components/Timer'
import OrangeButton from '../../components/OrangeButton'
import ViewCodeButton from '../../components/ViewCodeButton'
import styled from 'styled-components'
import vars from '../../styles/vars'

const Announce = styled(Container)`
	text-align: center;
	padding: 50px 0;
`
const CenteredDiv = styled.div`
	text-align: center;
	h1 {
		font-size: 300%;
		font-weight: 900;
		margin: 0 0 25px;
	}
	h3 {
		font-weight: bold;
	}
`
const StyledJumbotron = styled(Jumbotron)`
	background: ${vars.grey};
`
const Icon = styled(FontAwesomeIcon)`
	user-select: none;
	cursor: pointer;
`
const MiniSubmission = props => {
	const { idContest, idProb, parentCallback } = props
	const userData = useAuthContext()
	const [best, setBest] = useState([])
	const [lastest, setLastest] = useState([])
	const [SC, setSC] = useState('test')

	var waitingData = 0
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest/${idContest}/submission?idProb=${idProb}`
			const response = await fetch(url, {
				headers: {
					authorization: userData ? userData.id : ''
				}
			})
			const json = await response.json()
			setBest(json.best_submit)
			setLastest(json.lastest_submit)
			sendData(json.best_submit, json.lastest_submit)
			if (json.lastest_submit[0] !== undefined)
				if (json.lastest_submit[0].status == 0) {
					//waitingData = setInterval(fetchNewData, 1000)
				}
		}
		fetchData()
	}, [])
	const sendData = (lastest, best) => {
		if (lastest[0] !== undefined)
			parentCallback(lastest[0].score, best[0].idResult)
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
		const url = `${process.env.API_URL}/api/contest/${idContest}/submission?idProb=${idProb}`
		const response = await fetch(url, {
			headers: {
				authorization: userData.id
			}
		})
		const json = await response.json()
		setBest(json.best_submit)
		setLastest(json.lastest_submit)
		sendData(json.lastest_submit, json.best_submit)
		if (json.lastest_submit[0].status == 1) clearInterval(waitingData)
	}

	return (
		<Table size='sm' bordered hover>
			<thead>
				<tr>
					<th>#</th>
					<th>Result</th>
					<th>Score</th>
					<th>Code</th>
				</tr>
			</thead>
			<tbody>
				{lastest.map((prob, index) => {
					return (
						<tr key={index}>
							<td>Lastest</td>
							<td>{prob.result}</td>
							<td>{prob.score}</td>
							<td>
								<ViewCodeButton mini='true' idResult={prob.idResult} />
							</td>
						</tr>
					)
				})}
				{best.map((prob, index) => {
					return (
						<tr key={index}>
							<td>Best</td>
							<td>{prob.result}</td>
							<td>{prob.score}</td>
							<td>
								<ViewCodeButton mini='true' idResult={prob.idResult} />
							</td>
						</tr>
					)
				})}
			</tbody>
		</Table>
	)
}

const TaskCard = props => {
	const { idContest, id_Prob, index, name, whopass } = props
	const userData = useAuthContext()
	const [selectedFile, setSelectedFile] = useState(undefined)
	const [fileName, setFileName] = useState('')
	const [fileLang, setFileLang] = useState('C++')
	const [solved, setSolved] = useState(false)
	const [idBest, setIdBest] = useState(-1)
	const [passed, setPassed] = useState(whopass)

	const CustomToggle = props => {
		const [isHidden, setIsHidden] = useState(false)
		const handleClick = useAccordionToggle(props.eventKey, () => {
			setIsHidden(!isHidden)
		})
		return (
			<Accordion.Toggle
				{...props}
				as={Icon}
				className='float-right'
				icon={isHidden ? faChevronDown : faChevronUp}
				onClick={handleClick}
			/>
		)
	}
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
		const data = new FormData()
		data.append('file', selectedFile)
		data.append('fileLang', fileLang)
		const url = `${process.env.API_URL}/api/upload/${id_Prob}?contest=${idContest}`
		const respone = await fetch(url, {
			method: 'POST',
			headers: {
				authorization: userData ? userData.id : ''
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
	const callbackFunc = (ChildData, id) => {
		if (ChildData == 100) setSolved(true)
		setIdBest(id)
	}

	return (
		<Accordion as={Card} defaultActiveKey='0' className='mb-4'>
			<Card.Header as='h5'>
				Problem {index} : {name}
				{solved && <Badge variant='success'>Solved</Badge>}
				<CustomToggle eventKey='0' />
				<br />
				ผ่านแล้ว : {passed}
			</Card.Header>

			<Accordion.Collapse eventKey='0'>
				<Card.Body as={Row}>
					<Col>
						<MiniSubmission
							idContest={idContest}
							idProb={id_Prob}
							parentCallback={callbackFunc}
						/>
					</Col>
					<Col xs={0} lg={1} />
					<Col>
						<Form.File
							as={Col}
							className='mb-4'
							label={fileName || 'Choose file'}
							accept='.c,.cpp'
							onChange={selectFile}
							custom
						/>
						<ButtonToolbar as={Row}>
							<ButtonGroup className='ml-auto mr-4'>
								<Button variant='secondary'>View PDF</Button>
							</ButtonGroup>
							<ButtonGroup className='mr-auto'>
								<OrangeButton type='submit' onClick={uploadFile}>
									Submit
								</OrangeButton>
							</ButtonGroup>
						</ButtonToolbar>
					</Col>
				</Card.Body>
			</Accordion.Collapse>
		</Accordion>
	)
}
const Countdown = props => {
	const { startTime } = props
	return (
		<CenteredDiv>
			<h1>การแข่งขันกำลังจะเริ่ม</h1>
			<h3>
				ในอีก <Timer countTo={startTime} mode='th' />
				...
			</h3>
		</CenteredDiv>
	)
}
const EndingContest = props => {
	return (
		<CenteredDiv>
			<h1>การแข่งขันจบแล้ว</h1>
			<OrangeButton size='lg'>สรุปผลการแข่งขัน</OrangeButton>
		</CenteredDiv>
	)
}
const NoContest = props => {
	return (
		<CenteredDiv>
			<h1>ยังไม่มีการแข่งขัน</h1>
			<OrangeButton href='/contest/history' className='ml-auto'>
				See Contest History
			</OrangeButton>
		</CenteredDiv>
	)
}
const HoldingContest = props => {
	const { idContest, endTime } = props
	const [tasks, setTasks] = useState([])
	const userData = useAuthContext()
	useEffect(() => {
		const fetchData = async () => {
			const url = `${process.env.API_URL}/api/contest/${idContest}`
			let headers = { 'Content-Type': 'application/json' }
			headers['Authorization'] = userData ? userData.id : ''
			const res = await fetch(url, { headers })
			const json = await res.json()
			setTasks(json.problem)
		}
		fetchData()
	}, [])

	return (
		<>
			<Title icon={faTrophy} title='Contest Mode' noTop='true' noBot='true'>
				<h2>
					<Timer countTo={endTime} />
				</h2>
			</Title>
			<hr />
			{tasks.map((task, index) => (
				<TaskCard
					key={index}
					idContest={idContest}
					index={index + 1}
					{...task}
				/>
			))}
		</>
	)
}

const Contest = ({isContest}) => {
	var start,end,idContest,isAboutToStart,isHolding,isJustEnd = null
	if(isContest) {
		start = isContest.time_start
		const now = Math.floor(new Date() / 1000)
		end = isContest.time_end
		idContest = isContest.idContest
		isAboutToStart = now < start
		isHolding = start <= now && now <= end
		isJustEnd = now - end < 90 * 60
	}
	return (
		<>
			<Header />
			<Container>
				<Announce>
					<h1>ญินดีร์ฏ้อณลับสูเก็ดเฎอร์ฌาวไฑย</h1>
				</Announce>
			</Container>
			<StyledJumbotron>
				<Container fluid as={Row}>
					<Col xs={0} md={1} lg={2} />
					<Col xs={12} md={10} lg={8}>
						{isAboutToStart ? (
							<Countdown startTime={start} />
						) : isHolding ? (
							<HoldingContest endTime={end} idContest={idContest} />
						) : isJustEnd ? (
							<EndingContest />
						) : (
							<NoContest />
						)}
					</Col>
					<Col xs={0} md={1} lg={2} />
				</Container>
			</StyledJumbotron>
			<Container>
				{(isAboutToStart) && (
					<Row>
						<OrangeButton
							outline='true'
							href='/contest/history'
							className='ml-auto'
						>
							See History
						</OrangeButton>
					</Row>
				)}
				<Footer br={3} />
			</Container>
		</>
	)
}
Contest.getInitialProps = async ctx => {
	const url = `${process.env.API_URL}/api/contest`
	let headers = { 'Content-Type': 'application/json' }
	const res = await fetch(url, { headers })
	const json = await res.json()
	return { isContest : json[0] }
  }

export default withAuthSync(Contest)
