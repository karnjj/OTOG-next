import Link from 'next/link'
import Submit from './Submit'
import Popup from 'reactjs-popup'

import { isLogin } from '../utils/auth'
import { CustomTr, CustomTable } from './CustomTable'

const ProbTable = (props) => (
    <CustomTable>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Passed</th>
                <th>Ratings</th>
                {isLogin(props.userData) && <th>Submit</th>}
            </tr>
        </thead>
        <tbody>
            <ProbData {...props}></ProbData>
        </tbody>
    </CustomTable>
)

const ProbData = ({ problems, userData }) => (
    problems.map((prob) => {
        const { id_Prob, name, time, memory, sname, pass, acceptState, wrongState } = prob
        return (
            <CustomTr key={id_Prob} {...{acceptState, wrongState}}>
                <td>{id_Prob}</td>
                <td><Link href="/problem/[name]" as={`/problem/${sname}`}>
                    <a>{name}<br />({time} วินาที {memory} MB)</a>
                </Link></td>
                <td>
                {pass ? (
                    <Popup trigger={<a>{pass.length}</a>} position='left center'>
                        <div>{pass.map((item, i) => (
                            <div key={i}>{item}</div>
                        ))}</div>
                    </Popup>
                ) : (
                    <div>0</div>
                )}
                </td>
                <td>0</td>
                {isLogin(userData) && <td><Submit  {...prob} {...{userData}}></Submit></td>}
            </CustomTr>
        )
    })
)

export default ProbTable