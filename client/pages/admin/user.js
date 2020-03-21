import Error from 'next/error'
import { withAuthSync } from '../../utils/auth'
import Header from '../../components/admin/Header'

const UserConfig = (props) => {
    return (
        <>
			<Header/>
            <Error statusCode={404} />
        </>
    )
}
export default withAuthSync(UserConfig)