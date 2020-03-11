import Link from 'next/link'
import Submit from './Submit'
import Popup from "reactjs-popup";
const ProbTABLE = (props) => {
    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr id="coltable">
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Passed</th>
                        <th scope="col">Ratings</th>
                        <th scope="col">Submit</th>
                    </tr>
                </thead>
                <tbody>
                    <ProbData problems={props.problem}></ProbData>
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
}

const ProbData = ({ problems }) => (
    problems.map(problem => {
        const { id_Prob, name, time, mem, sname, pass } = problem
        return (
            <tr key={id_Prob}>
                <td>{id_Prob}</td>
                <td><Link href={`/problem/${sname}`}>
                    <a className='otogtxt'>{name}<br />({time} วินาที {mem} MB)</a>
                </Link></td>
                <td><Popup trigger={<div>{pass ? pass.length : 0}</div>} position="left center">
                    <div>{pass==undefined ? '' :pass.map((item,i) => <div key={i}>{item}</div>)}</div>
                </Popup></td>
                <td>0</td>
                <td><Submit prob={problem}></Submit></td>
            </tr>
        )
    })
)

export default ProbTABLE