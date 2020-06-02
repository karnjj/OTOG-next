import { Spinner, Row, Table } from 'react-bootstrap'
import styled, { keyframes } from 'styled-components'
import { darken } from 'polished'
import vars from '../styles/vars'
import { range } from '../utils/array'

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
const Text = styled.div`
	height: 16px;
	max-width: 160px;
	background: ${vars.grey};
	animation: ${pulse} 1s ease ${(props) => props.delay + 's'} infinite;
`
const AnimationTable = styled(Table)`
	text-align: center;
	th {
		height: 50px;
		text-align: center;
	}
	td {
		height: 73px;
		text-align: center;
	}
`
const Loader = () => (
	<Row className='justify-content-center py-5'>
		<StyledSpinner animation='border' role='status'>
			<span className='sr-only'>Loading...</span>
		</StyledSpinner>
	</Row>
)
export const TableLoader = () => {
	return (
		<>
			<AnimationTable responsive>
				<thead>
					<tr>
						{range(5).map((i) => (
							<th key={i}>
								<Text delay={i * 0.04} />
							</th>
						))}
					</tr>
				</thead>
			</AnimationTable>
			<Loader />
		</>
	)
}
export default Loader
