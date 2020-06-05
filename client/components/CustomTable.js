import vars from '../styles/vars'
import styled, { keyframes } from 'styled-components'

import { Table } from 'react-bootstrap'
import { TableLoader } from './Loader'

const customColor = (props) =>
	props.acceptState ? vars.accept : props.wrongState && vars.wrong

export const CustomTr = styled.tr`
	background: ${customColor};
	&:hover td {
		background: ${vars.hover};
	}
`
export const CustomTd = styled.td`
	background: ${customColor};
`
const fadein = keyframes`
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`
const CenterTable = styled(Table)`
	text-align: center;
	th {
		color: ${vars.orange};
		&:hover {
			color: ${vars.orange};
			cursor: pointer;
		}
	}
	tr {
		animation: ${fadein} 0.5s ease;
	}
`
export const CustomTable = ({ ready = true, ...props }) => {
	return ready ? <CenterTable responsive hover {...props} /> : <TableLoader />
}
