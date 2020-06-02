import Link from 'next/link'
import vars from '../styles/vars'
import styled from 'styled-components'

import { Button } from 'react-bootstrap'
import { darken } from 'polished'

const StyledButton = styled(Button).attrs((props) => ({
	primary: props.outline ? vars.white : vars.orange,
	secondary: props.outline ? vars.orange : vars.white,
	tertiary: props.outline ? vars.black : vars.black,
	padsize: props.expand && `6px ${6 + props.expand}px`,
}))`
	color: ${(props) => props.secondary};
	background: ${(props) => props.primary};
	border: 1px solid ${vars.orange};
	padding: ${(props) => props.padsize};
	a {
		color: ${(props) => props.secondary};
	}
	&:hover {
		color: ${(props) => props.tertiary};
		background: ${vars.orange};
	}
	&:active,
	&:focus {
		background: ${darken(0.1, vars.orange)}!important;
	}
`

const OrangeButton = ({ href, dynamic, ...props }) =>
	href ? (
		<Link href={href} as={dynamic}>
			<StyledButton variant='warning' {...props} />
		</Link>
	) : (
		<StyledButton variant='warning' {...props} />
	)

export default OrangeButton
