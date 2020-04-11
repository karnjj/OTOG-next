import vars from '../styles/vars'
import styled, { keyframes } from 'styled-components'

import { Table } from 'react-bootstrap'
import Loader, { TableLoader } from './Loader'

const customColor = (props) =>
	props.acceptState ? vars.accept : props.wrongState && vars.wrong

export const Alink = styled.a`
	color: ${vars.orange};
	&:hover {
		color: ${vars.orange};
		cursor: pointer;
	}
`
export const CustomTr = styled.tr`
	background: ${customColor};
	&:hover td {
		background: ${vars.hover};
	}
`
export const CustomTd = styled.td`
	background: ${customColor};
`
const Name = styled.a`
	color: ${(props) => {
		if (props.score >= 2000) {
			return vars.grandmaster
		} else if (props.score >= 1800) {
			return vars.master
		} else {
			return vars.regular
		}
	}}!important;
`
export const UserTd = (props) => (
	<td>
		<Name {...props} />
	</td>
)
const fadein = keyframes`
	0% {
		opacity: 0;
		transform : translateY(-5px);
	}
	100% {
		opacity: 1;
		transform: translateY(0px);
	}
`
const CenterTable = styled(Table)`
	text-align: center;
	th,
	a {
		color: ${vars.orange};
		&:hover {
			color: ${vars.orange};
			cursor: pointer;
		}
	}
	tr {
		animation: ${fadein} 0.3s ease;
	}
`
export const CustomTable = ({ ready = true, ...props }) => {
	return ready ? <CenterTable responsive hover {...props} /> : <TableLoader />
}
