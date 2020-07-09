import Link from 'next/link'
import { Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import vars from '../styles/vars'

export const Title = ({ icon, text, paddingTop = true, children }) => (
	<Row className={`${paddingTop ? 'pt-5' : ''} pb-3`}>
		<Col xs='auto' className='mr-auto'>
			<h2>
				<FontAwesomeIcon icon={icon} /> {text}
			</h2>
		</Col>
		<Col xs='auto'>{children}</Col>
	</Row>
)

export const ColoredText = styled.a`
	color: ${(props) => {
		if (props.state === 0) {
			return vars.admin
		} else if (props.rating == 0) {
			return vars.unrate
		} else if (props.rating >= 2500) {
			return vars.legendary
		} else if (props.rating >= 2000) {
			return vars.grandmaster
		} else if (props.rating >= 1800) {
			return vars.master
		} else if (props.rating >= 1650) {
			return vars.professional
		} else if (props.rating >= 1500) {
			return vars.regular
		} else return vars.pupil
	}}!important;
`

export const Name = ({ sname, children, idUser, ...rest }) => (
	<Link href='/profile/[id]' as={`/profile/${idUser ?? 0}`} passHref>
		<ColoredText {...rest}>
			{sname}
			{children}
		</ColoredText>
	</Link>
)

export const Alink = styled.a`
	color: ${vars.black}!important;
	&:hover {
		color: ${vars.orange}!important;
		cursor: pointer !important;
	}
`
