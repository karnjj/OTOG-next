import Link from 'next/link'
import Submit from './Submit'

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
    problems.map(prob => {
        const { id_Prob, name, time, mem } = prob
        return (
            <tr key={id_Prob}>
                <td>{id_Prob}</td>
                <td><Link href={`docs/${id_Prob}`}>
                    <a className='otogtxt'>{name}<br />({time} วินาที {mem} MB)</a>
                </Link></td>
                <td>0</td>
                <td>0</td>
                <td><Submit prob={prob}></Submit></td>
            </tr>
        )
    })
)

export default ProbTABLE