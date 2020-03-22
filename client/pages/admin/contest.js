import Error from 'next/error'

import { withAuthSync, useAuthContext, withAdminAuth } from '../../utils/auth'
import Header from '../../components/admin/Header'

const Contest = props => {
	const userData = useAuthContext()
	return (
		<>
			<Header />
			<Error statusCode={404} />
		</>
	)
}
export default withAdminAuth(withAuthSync(Contest))
