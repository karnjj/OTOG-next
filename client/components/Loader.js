import { Spinner, Row } from 'react-bootstrap'
import styled from 'styled-components'
import vars from '../styles/vars'

const StyledSpinner = styled(Spinner)`
	color: ${vars.orange};
`

const Loader = () => (
	<Row className='mx-auto justify-content-center py-5'>
		<StyledSpinner animation='border' role='status'>
			<span className='sr-only'>Loading...</span>
		</StyledSpinner>
	</Row>
)
export default Loader
