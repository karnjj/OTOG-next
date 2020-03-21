import { useAuthContext } from '../utils/auth'

import Popup from 'reactjs-popup'
import { CustomTr, CustomTable } from './CustomTable'

import SubmitGroup from './SubmitGroup'
import ViewCodeButton from './ViewCodeButton'

const ProbTable = (props) => {
    const userData = useAuthContext()
    return (
        <CustomTable>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Passed</th>
                    <th>Ratings</th>
                    {userData && <th>Submit</th>}
                </tr>
            </thead>
            <tbody>
            {props.problems.map((prob, index) => 
                <ProbTr key={index} {...prob}/>
            )}
            </tbody>
        </CustomTable>
    )
}

const ProbTr = (props) => {
    const userData = useAuthContext()
    const { id_Prob, name, time, memory, sname, pass, acceptState, wrongState } = props
    return (
        <CustomTr {...{acceptState, wrongState}}>
            <td>{id_Prob}</td>
            <td>
                <a target='_blank' href={`${process.env.API_URL}/api/docs/${sname}`}>
                    {name}<br />({time} วินาที {memory} MB)
                </a>
            </td>
            <td>
            {pass ? (
                <Popup trigger={<a>{pass.length}</a>} position='left center'>
                    <div>
                    {pass.map((item, i) => (
                        <div key={i}>{item}</div>
                    ))}
                    </div>
                </Popup>
            ) : <div>0</div>}
            </td>
            <td>0</td>
            {userData && <td>
                <SubmitGroup  {...props}>
                {(acceptState || wrongState) &&
                    <ViewCodeButton/>
                }
                </SubmitGroup>
            </td>}
        </CustomTr>
    )
}

export default ProbTable