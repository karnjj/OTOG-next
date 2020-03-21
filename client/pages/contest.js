import Error from 'next/error'
import { withAuthSync } from '../utils/auth'
import Header from '../components/Header'

const Contest = () => {
    return (
        <>
            <Header/>
            <Error statusCode={404} />
        </>
    )
}
export default withAuthSync(Contest)