import { Form } from 'react-bootstrap'
import styled from 'styled-components'
import vars from '../styles/vars'

const OrangeCheck = styled(Form.Check)`
	.custom-control-input:checked ~ .custom-control-label::before {
		background: ${vars.orange};
		border: ${vars.orange};
	}
`
export default OrangeCheck
