import Link from 'next/link'
import Submit from './Submit'
import Popup from 'reactjs-popup'
import { isLogin } from '../utils/auth'
import { Table } from 'react-bootstrap'
import styled from 'styled-components'
import vars from '../styles/vars'

const CenteredTable = styled(Table)`
    text-align: center;
    th, a {
        color: ${vars.orange};
    }
`
const Tr = styled.tr`
    background: ${props => props.accept ? rgb(235,255,235) : props.wrong && rgb(255,235,235)};
    & hover {
        background: ${props => props.accept ? rgb(235,255,235) : props.wrong && rgb(255,235,235)};
    }
`

const ProbTable = (props) => (
    <CenteredTable responsive hover>
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Passed</th>
                <th scope="col">Ratings</th>
                {isLogin(props.userData) && <th scope="col">Submit</th>}
            </tr>
        </thead>
        <tbody>
            <ProbData {...props}></ProbData>
        </tbody>
    </CenteredTable>
)

const ProbData = ({ problems, userData }) => (
    problems === undefined ? null : problems.map(problem => {
        const { id_Prob, name, time, memory, sname, pass } = problem
        return (
            <Tr key={id_Prob} accept={false} wrong={false} >
                <td>{id_Prob}</td>
                <td><Link href="/problem/[name]" as={`/problem/${sname}`}>
                    <a className='otogtxt'>{name}<br />({time} วินาที {memory} MB)</a>
                </Link></td>
                <td><Popup trigger={<div>{pass ? pass.length : 0}</div>} position="left center">
                    <div>{pass === undefined ? '' :pass.map((item, i) => <div key={i}>{item}</div>)}</div>
                </Popup></td>
                <td>0</td>
                {isLogin(userData) && <td><Submit  {...problem} {...{userData}}></Submit></td>}
            </Tr>
        )
    })
)

export default ProbTable