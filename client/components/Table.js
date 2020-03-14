import Link from 'next/link'
import OtogTable from './CenteredTable'

const RankedTable = (props) => (
    <OtogTable>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Passed</th>
                <th>Ratings</th>
            </tr>
        </thead>
        <tbody>
        {props.problem.map(({ id_Prob, id, name, time }) => (
            <tr key={id_Prob}>
                <td>{id_Prob}</td>
                <td><Link href={"docs/" + id}>{name}<br />({time} วินาที {mem} MB)</Link></td>
                <td>0</td>
                <td>0</td>
            </tr>
        ))}
        </tbody>
    </OtogTable>
)

export default RankedTable