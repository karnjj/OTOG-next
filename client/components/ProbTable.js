import Link from 'next/link'
import Submit from './Submit'
import Popup from 'reactjs-popup'
import { isLogin } from '../utils/auth'

const ProbTable = (props) => (
    <div className="table-responsive">
        <table className="table table-hover">
            <thead>
                <tr id="coltable">
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Passed</th>
                    <th scope="col">Ratings</th>
                    {isLogin(props.userData) && <th scope="col">Submit</th>}
                </tr>
            </thead>
            <tbody>
                <ProbData problems={props.problems} userData={props.userData}></ProbData>
            </tbody>
        </table>
        <style jsx>{`
            table {
                text-align: center;
            }
            #coltable {
                color: #FF851B;
            }
        `}</style>
    </div>
)

const ProbData = (props) => (
    props.problems.map(problem => {
        const { id_Prob, name, time, memory, sname, pass } = problem
        return (
            <tr key={id_Prob}>
                <td>{id_Prob}</td>
                <td><Link href="/problem/[name]" as={`/problem/${sname}`}>
                    <a className='otogtxt'>{name}<br />({time} วินาที {memory} MB)</a>
                </Link></td>
                <td><Popup trigger={<div>{pass ? pass.length : 0}</div>} position="left center">
                    <div>{pass==undefined ? '' :pass.map((item,i) => <div key={i}>{item}</div>)}</div>
                </Popup></td>
                <td>0</td>
                {isLogin(props.userData) && <td><Submit {...problem}></Submit></td>}
            </tr>
        )
    })
)

export default ProbTable