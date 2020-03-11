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
<<<<<<< HEAD
                <ProbData problems={props.problem}></ProbData>
=======
>>>>>>> f744930686fce629c30e1c2eb6bc913234d03d8d
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
<<<<<<< HEAD
    problems.map(prob => {
        const { id_Prob, name, time, mem } = prob
||||||| merged common ancestors
    problems.map(problem => {
        const { id_Prob, name, time, mem } = problem
=======
    problems.map(problem => {
        const { id_Prob, name, time, mem, sname, pass } = problem
<<<<<<< HEAD

=======
>>>>>>> aaea72b19b3e2568337282c9bfc6c2632cc49d7e
>>>>>>> f744930686fce629c30e1c2eb6bc913234d03d8d
        return (
            <tr key={id_Prob}>
                <td>{id_Prob}</td>
                <td><Link href={`/problem/${sname}`}>
                    <a className='otogtxt'>{name}<br />({time} วินาที {mem} MB)</a>
                </Link></td>
<<<<<<< HEAD
                <td><Popup trigger={<div>{pass ? pass.length : 0}</div>} position="left center">
                    <div>{pass==undefined ? '' :pass.map((item,i) => <div key={i}>{item}</div>)}</div>
                </Popup></td>
=======
<<<<<<< HEAD
                <td>0</td>
                <td>0</td>
                <td><Submit prob={prob}></Submit></td>
||||||| merged common ancestors
                <td>0</td>
                <td>0</td>
                <td><Submit prob={problem}></Submit></td>
=======
                <td>{pass ? pass.length : 0}</td>
>>>>>>> f744930686fce629c30e1c2eb6bc913234d03d8d
                <td>1500</td>
                <td><Submit prob={problem}></Submit></td>
>>>>>>> aaea72b19b3e2568337282c9bfc6c2632cc49d7e
            </tr>
        )
    })
)

export default ProbTABLE