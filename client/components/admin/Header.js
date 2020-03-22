import { withRouter } from 'next/router'

import { Nav } from 'react-bootstrap'
import { NavLink, ScrollNavbar, HeaderSpace } from '../CustomNavbar'
import {
	faWrench,
	faTasks,
	faUserCog,
	faTrophy,
	faTimes
} from '@fortawesome/free-solid-svg-icons'

const Header = props => {
	const { router } = props
	return (
		<>
			<HeaderSpace />
			<ScrollNavbar bg='dark' variant='dark' fixed='top'>
				<Nav>
					{[
						['Main', faWrench, '/admin'],
						['Task', faTasks, '/admin/task'],
						['User', faUserCog, '/admin/user'],
						['Contest', faTrophy, '/admin/contest']
					].map(([name, icon, path], index) => (
						<NavLink
							{...{ name, icon, path }}
							key={index}
							active={path === router.pathname}
						/>
					))}
					<NavLink name='Exit' icon={faTimes} red='true' path='/' />
				</Nav>
			</ScrollNavbar>
		</>
	)
}

export default withRouter(Header)
