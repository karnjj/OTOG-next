import vars from '../styles/vars'
import styled from 'styled-components'

import { Table } from 'react-bootstrap'

export const CustomTr = styled.tr`
    background: ${props => props.acceptState ? 
        ('#ebffeb') : (props.wrongState && '#ffebeb')
    };
`
const CenterTable = styled(Table)`
    text-align: center;
    th, a {
        color: ${vars.orange};
        &:hover {
            color: ${vars.orange};
            cursor: pointer;
        }
    }
`
export const CustomTable = ({ children }) => (
    <CenterTable responsive hover>
        {children}
    </CenterTable>
)
