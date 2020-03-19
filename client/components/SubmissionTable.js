import { isLogin } from '../utils/auth'
import { CustomTr, CustomTable, Name } from './CustomTable'

import ViewCodeButton from './ViewCodeButton'
import { ButtonGroup } from 'react-bootstrap'

const SubmissionTable = (props) => (
    <CustomTable>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Problem</th>
                <th>Result</th>
                <th>Time</th>
                <th>Score</th>
                {isLogin(props.userData) && <th>Code</th>}
            </tr>
        </thead>
        <tbody>
            <SubData {...props}/>
        </tbody>
    </CustomTable>
)

const SubData = ({ results, userData }) => {
    return results.map((res) => {
        const { username, name, time, score, result, acceptState, submitNumber } = res
        return (
            <CustomTr key={submitNumber} {...{acceptState}}>
                <td>{submitNumber}</td>
                <td><Name>{username}</Name></td>
                <td>{name}</td>
                <td>{result}</td>
                <td>{time} s</td>
                <td>{score}</td>
                {isLogin(userData) && <td>
                    <ButtonGroup>
                        <ViewCodeButton/>
                    </ButtonGroup>
                </td>}
            </CustomTr>
        )
    })
}

export default SubmissionTable