import { Alink } from './CustomText'
import { logout, useAuthContext, isAdmin } from '../utils/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'

import {
	Row,
	Col,
	Container,
	Nav,
	Navbar,
	NavDropdown,
	Image,
} from 'react-bootstrap'
import {
	ScrollNavbar,
	HeaderSpace,
	NavLink,
	NavTitle,
	NavText,
} from './CustomNavbar'
import {
	faHome,
	faPuzzlePiece,
	faTrophy,
	faChartBar,
	faSignInAlt,
	faUser,
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

const ProfileImage = styled(Image)`
	width: 28px;
	height: 28px;
	margin: -2px 0;
`
export const Header = () => {
	const userData = useAuthContext()
	const router = useRouter()
	const navLinks = [
		//name, icon, paths, exact
		['Main', faHome, ['/'], true],
		['Problems', faPuzzlePiece, ['/problem', '/submission'], false],
		['Contest', faTrophy, ['/contest'], false],
		['Ratings', faChartBar, ['/rating'], false],
	]
	const handleClickLogout = () => logout(userData)
	return (
		<>
			<HeaderSpace />
			<ScrollNavbar
				collapseOnSelect
				expand='md'
				bg='light'
				expand='sm'
				fixed='top'
			>
				<Link href={isAdmin(userData) ? '/admin' : '/'} passHref>
					<Navbar.Brand
						className='mr-auto'
						target={isAdmin(userData) ? '_blank' : undefined}
					>
						<NavTitle>
							OTOG<NavText> - One Tambon One Grader</NavText>
						</NavTitle>
					</Navbar.Brand>
				</Link>
				<Navbar.Toggle aria-controls='responsive-navbar-nav' />
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='ml-auto'>
						{navLinks.map(([name, icon, paths, exact]) => (
							<NavLink
								{...{ name, icon }}
								className='mx-2 mx-xl-0'
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
								title={
									<ProfileImage
										className='mx-1 ml-xl-0'
										src={`${process.env.API_URL}/api/avatar/${userData.id}`}
										roundedCircle
									/>
								}
							>
								<Link
									href='/profile/[id]'
									as={`/profile/${userData.id}`}
									passHref
									prefetch={false}
								>
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
					</Nav>
				</Navbar.Collapse>
			</ScrollNavbar>
		</>
	)
}

export const Footer = () => (
	<>
		<hr />
		<Row sm={1} className='mb-3'>
			<Col md='auto' className='mr-auto'>
				If you have any problem or suggestion, please{' '}
				<Alink href='https://fb.me/kkuotog' target='_blank'>
					Contact Us
				</Alink>
			</Col>
			<Col md='auto'>&copy; 2019 Phakphum Dev Team</Col>
		</Row>
	</>
)

const FullWindowLayout = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

export default ({ noContainer, noFooter, children }) => (
	<FullWindowLayout>
		<div>
			<Header />
			{noContainer ? <>{children}</> : <Container>{children}</Container>}
		</div>
		{!noFooter && (
			<Container>
				<Footer />
			</Container>
		)}
	</FullWindowLayout>
)