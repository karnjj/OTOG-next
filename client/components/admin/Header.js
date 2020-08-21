import { useRouter } from 'next/router'

import { Nav, Container } from 'react-bootstrap'
import { NavLink, ScrollNavbar, HeaderSpace } from '../CustomNavbar'
import {
	faWrench,
	faTasks,
	faUserCog,
	faTrophy,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'

const adminNavEntries = [
	['Main', faWrench, '/admin'],
	['Task', faTasks, '/admin/task'],
	['User', faUserCog, '/admin/user'],
	['Contest', faTrophy, '/admin/contest'],
]

const Header = () => {
	const router = useRouter()
	const handleClose = () => {
		window.open('/', '_self')
		window.close()
	}
	return (
		<>
			<HeaderSpace />
			<ScrollNavbar bg='dark' variant='dark' fixed='top'>
				<Container>
					<Nav>
						{adminNavEntries.map(([name, icon, path]) => (
							<NavLink
								{...{ name, icon, path }}
								key={name}
								active={path === router.pathname}
							/>
						))}
						<NavLink
							name='Exit'
							icon={faTimes}
							red='true'
							onClick={handleClose}
						/>
					</Nav>
				</Container>
			</ScrollNavbar>
		</>
	)
}

export default Header
