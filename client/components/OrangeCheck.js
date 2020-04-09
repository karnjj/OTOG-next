import { Form } from 'react-bootstrap'
import styled from 'styled-components'
import vars from '../styles/vars'
import { lighten, darken } from 'polished'

const OrangeCheck = styled(Form.Check)`
	.custom-control-input:checked ~ .custom-control-label::before {
		background: ${vars.orange};
		border-color: ${darken(0.15, vars.orange)};
		box-shadow: 0 0 0 3px ${lighten(0.3, vars.orange)};
	}
	.custom-control-input:active ~ .custom-control-label::before {
		background: ${lighten(0.2, vars.orange)};
		border-color: ${lighten(0.25, vars.orange)};
	}
	.custom-control-input:focus ~ .custom-control-label::before {
		box-shadow: 0 0 0 3px ${lighten(0.3, vars.orange)};
		border-color: ${vars.orange};
	}
`
export default OrangeCheck
