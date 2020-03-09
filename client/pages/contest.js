import Header from '../components/Header'
import Error from 'next/error'
import App from '../components/App'
import { withAuthSync } from '../utils/auth'
const Contest = (props) => {
    const userData = props.jsData
    return(
        <App>
            <Header userData={userData}/>
            <Error statusCode={404} />
        </App>
    )
}
export default withAuthSync(Contest)