import Link from 'next/link'
import vars from '../styles/vars'
import styled from 'styled-components'

import { Button } from 'react-bootstrap'
import { darken } from 'polished'

const StyledButton = styled(Button)`
	float: ${props => props.right && 'right'};
	color: ${props => (props.outline ? vars.orange : vars.white)};
	background: ${props => (props.outline ? vars.white : vars.orange)};
	border: 1px solid ${vars.orange};
	padding: ${props => `6px ${6 + props.expand}px`};
	a {
		color: ${props => (props.outline ? vars.orange : vars.white)};
	}
	&:hover {
		color: ${props => (props.outline ? vars.white : vars.black)};
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
