import Popup from 'reactjs-popup'

import { isLogin } from '../utils/auth'
import { CustomTr, CustomTable } from './CustomTable'

import SubmitGroup from './SubmitGroup'
import ViewCodeButton from './ViewCodeButton'

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

const ProbData = ({ problems, userData }) => {
    return problems.map((prob) => {
        const { id_Prob, name, time, memory, sname, pass, acceptState, wrongState } = prob
        return (
            <CustomTr key={id_Prob} {...{acceptState, wrongState}}>
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
                {isLogin(userData) && <td>
                    <SubmitGroup  {...prob} {...{userData}}>
                    {(acceptState || wrongState) &&
                        <ViewCodeButton/>
                    }
                    </SubmitGroup>
                </td>}
            </CustomTr>
        )
    })
}

export default ProbTable