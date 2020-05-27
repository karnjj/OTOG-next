import Link from 'next/link'
import vars from '../styles/vars'
import styled from 'styled-components'

import { Button } from 'react-bootstrap'
import { darken } from 'polished'

const StyledButton = styled(Button)`
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

const OrangeButton = ({ href, dynamic, target, prefetch, ...props }) =>
	href ? (
		<Link href={href} as={dynamic} target={target} prefetch={prefetch}>
			<StyledButton variant='warning' {...props} />
		</Link>
	) : (
		<StyledButton variant='warning' {...props} />
	)

export default OrangeButton
