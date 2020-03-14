import Error from 'next/error'
import { withAuthSync } from '../utils/auth'
const Contest = (props) => {
    return(
        <>
            <Error statusCode={404} />
        </>
    )
}
export default withAuthSync(Contest)