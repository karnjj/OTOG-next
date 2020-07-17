import { useAuthContext } from '../utils/auth'
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
	const { userData, isLogin, isAdmin, logout } = useAuthContext()
	const router = useRouter()
	const navLinks = [
		//name, icon, paths, exact
		['Main', faHome, ['/'], true],
		['Problems', faPuzzlePiece, ['/problem', '/submission'], false],
		['Contest', faTrophy, ['/contest'], false],
		['Ratings', faChartBar, ['/rating'], false],
	]
	const handleClickLogout = () => logout()
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
				<Link href={isAdmin ? '/admin' : '/'} passHref>
					<a target={isAdmin ? '_blank' : undefined}>
						<Navbar.Brand
							className='mr-auto'
						>
							<NavTitle>
								OTOG<NavText> - One Tambon One Grader</NavText>
							</NavTitle>
						</Navbar.Brand>
					</a>
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
						{isLogin ? (
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
										<NavTitle name='Profile' icon={faUser} shrink={false} />
									</NavDropdown.Item>
								</Link>
								<NavDropdown.Divider />
								<NavDropdown.Item onClick={handleClickLogout}>
									<NavTitle
										name='Logout'
										icon={faSignInAlt}
										red='true'
										shrink={false}
									/>
								</NavDropdown.Item>
							</NavDropdown>
						) : (
							<NavLink
								name='Login'
								className='mx-2 mx-xl-0'
								icon={faSignInAlt}
								path='/login'
							/>
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
				<a href='https://fb.me/kkuotog' target='_blank'>
					Contact Us
				</a>
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

export default ({ container = true, children, ...rest }) => {
	return container ? (
		<FullWindowLayout>
			<div>
				<Header />
				<Container {...rest}>{children}</Container>
			</div>
			<Container>
				<Footer />
			</Container>
		</FullWindowLayout>
	) : (
		<FullWindowLayout>
			<Header />
			<div {...rest}>{children}</div>
			<Container>
				<Footer />
			</Container>
		</FullWindowLayout>
	)
}
