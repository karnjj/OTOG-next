import { Spinner, Row, Table } from 'react-bootstrap'
import styled, { keyframes } from 'styled-components'
import { darken } from 'polished'
import vars from '../styles/vars'

const StyledSpinner = styled(Spinner)`
	color: ${vars.orange};
`
const pulse = keyframes`
	0% {
		background: ${vars.grey};
	}
	25% {
		background: ${darken(0.1, vars.grey)};
	}
	50% {
		background: ${vars.grey};
	}
`
const AnimationTable = styled(Table)`
	text-align: center;
	th {
		height: 50px;
	}
	td {
		height: 73px;
	}
	th {
		animation: ${pulse} 1s ease infinite;
	}
	tbody {
		tr:nth-child(1) {
			animation: ${pulse} 1s ease 0.2s infinite;
		}
		tr:nth-child(2) {
			animation: ${pulse} 1s ease 0.4s infinite;
		}
		tr:nth-child(3) {
			animation: ${pulse} 1s ease 0.6s infinite;
		}
		tr:nth-child(4) {
			animation: ${pulse} 1s ease 0.8s infinite;
		}
		tr:nth-child(5) {
			animation: ${pulse} 1s ease 1s infinite;
		}
	}
`
const Loader = () => (
	<Row className='mx-auto justify-content-center py-5'>
		<StyledSpinner animation='border' role='status'>
			<span className='sr-only'>Loading...</span>
		</StyledSpinner>
	</Row>
)
export const TableLoader = () => {
	return (
		<AnimationTable responsive>
			<thead>
				<tr>
					<th> </th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td> </td>
				</tr>
				<tr>
					<td> </td>
				</tr>
				<tr>
					<td> </td>
				</tr>
				<tr>
					<td> </td>
				</tr>
				<tr>
					<td> </td>
				</tr>
			</tbody>
		</AnimationTable>
	)
}
export default Loader
