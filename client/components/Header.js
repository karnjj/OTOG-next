import { logout, useAuthContext, isAdmin } from '../utils/auth'
import { useRouter } from 'next/router'
import { Navbar,NavDropdown } from 'react-bootstrap'
import styled from 'styled-components'
import {
	StyledNavLink,
	ScrollNavbar,
	HeaderSpace,
	RowNav,
	NavLink,
} from './CustomNavbar'
import {
	faHome,
	faPuzzlePiece,
	faTrophy,
	faChartBar,
	faSignInAlt,
	faUser
} from '@fortawesome/free-solid-svg-icons'

export const ImgProfile = styled.img`
	width: 32px;
	height: 32px;
	border-radius: 50%;
`

const Header = () => {
	const userData = useAuthContext()
	const router = useRouter()
	const navLinks = [
		//name, favicon, paths
		['Main', faHome, ['/']],
		['Problems', faPuzzlePiece, ['/problem', '/submission']],
		[
			'Contest',
			faTrophy,
			['/contest', '/contest/history', '/contest/[id]', '/contest/submission'],
		],
		['Ratings', faChartBar, ['/rating']],
	]
	const handleClickLogout = () => logout(userData)
	return (
		<>
			<HeaderSpace />
			<ScrollNavbar bg='light' expand='sm' fixed='top'>
				<Navbar.Brand className='mr-auto'>
					<StyledNavLink href={isAdmin(userData) ? '/admin' : '/'} target={isAdmin(userData) && "_blank"}>
						OTOG<span> - One Tambon One Grader</span>
					</StyledNavLink>
				</Navbar.Brand>
				<RowNav>
					{navLinks.map(([name, icon, paths]) => (
						<NavLink
							{...{ name, icon }}
							path={paths[0]}
							key={name}
							active={paths.some((path) => path === router.pathname)}
						/>
					))}
					{userData ? (
						<NavDropdown alignRight title={<ImgProfile src={'/test.png'}/>} id="nav-dropdown" >
							<NavDropdown.Item eventKey="4.1">
								<NavLink
									name='Profile'
									icon={faUser}
									path={`/profile/test`}
								/></NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item eventKey="4.2">
								<NavLink
									name='Logout'
									icon={faSignInAlt}
									onClick={handleClickLogout}
									red='true'
								/>
							</NavDropdown.Item>
					 	</NavDropdown>
					) : (
						<NavLink name='Login' icon={faSignInAlt} path='/login' />
					)}
				</RowNav>
			</ScrollNavbar>
		</>
	)
}
export default Header
