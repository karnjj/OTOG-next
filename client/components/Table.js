import Link from 'next/link'
export default function ProbTABLE(props) {
    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr id="coltable">
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Passed</th>
                        <th scope="col">Ratings</th>
                    </tr>
                </thead>
                <tbody>
                    {props.problem.map(prob => (
                        <tr key={prob.id_Prob}>
                            <td>{prob.id_Prob}</td>
                            <td><Link href={"docs/" + prob.id}><a className='otogtxt'>{prob.name}<br />({prob.time} วินาที {prob.mem} MB)</a></Link></td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                    ))}
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
