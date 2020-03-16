import vars from '../styles/vars'
import styled from 'styled-components'

import { Button } from 'react-bootstrap'
import { darken } from 'polished'

const StyledButton = styled(Button)`
    padding: ${props => props.expand && '6px 12px'};
    color: ${props => props.outline ? vars.orange : vars.white};
    background: ${props => props.outline ? vars.white : vars.orange};
    border: 1px solid ${vars.orange};
    &:hover {
        color: ${props => props.outline ? vars.white : vars.black};
        background: ${vars.orange};
    }
    &:active, &:focus {
        background: ${darken(0.1, vars.orange)}!important; 
    }
`

const OrangeButton = ({ children, ...rest }) => (
    <StyledButton variant='warning' {...rest}>
        {children}
    </StyledButton>
)

export default OrangeButton