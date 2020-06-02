import { logout, useAuthContext, isAdmin } from '../utils/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import {
	ScrollNavbar,
	HeaderSpace,
	RowNav,
	NavLink,
	NavTitle,
} from './CustomNavbar'
import {
	faHome,
	faPuzzlePiece,
	faTrophy,
	faChartBar,
	faSignInAlt,
	faUser,
	faUserCircle,
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
		//name, favicon, paths, exact
		['Main', faHome, ['/'], true],
		['Problems', faPuzzlePiece, ['/problem', '/submission'], false],
		['Contest', faTrophy, ['/contest'], false],
		['Ratings', faChartBar, ['/rating'], false],
	]
	const handleClickLogout = () => logout(userData)
	return (
		<>
			<HeaderSpace />
			<ScrollNavbar bg='light' expand='sm' fixed='top'>
				<Link href={isAdmin(userData) ? '/admin' : '/'} passHref>
					<Navbar.Brand
						className='mr-auto'
						target={isAdmin(userData) ? '_blank' : undefined}
					>
						<NavTitle>
							OTOG<span> - One Tambon One Grader</span>
						</NavTitle>
					</Navbar.Brand>
				</Link>
				<RowNav>
					{navLinks.map(([name, icon, paths, exact]) => (
						<NavLink
							{...{ name, icon }}
							path={paths[0]}
							key={name}
							active={paths.some((path) =>
								exact
									? path === router.pathname
									: path === router.pathname.slice(0, path.length)
							)}
						/>
					))}
					{userData ? (
						<NavDropdown
							alignRight
							title={<ImgProfile src={`${process.env.API_URL}/api/avatar/${userData.id}`}/>}
						>
							<Link href={`/profile/${userData.id}`} passHref>
								<NavDropdown.Item>
									<NavTitle name='Profile' icon={faUser} noShrink='true' />
								</NavDropdown.Item>
							</Link>
							<NavDropdown.Divider />
							<NavDropdown.Item>
								<NavTitle
									name='Logout'
									icon={faSignInAlt}
									onClick={handleClickLogout}
									red='true'
									noShrink='true'
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
