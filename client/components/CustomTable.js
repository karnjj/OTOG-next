import vars from '../styles/vars'
import styled from 'styled-components'

import { Table } from 'react-bootstrap'

export const Alink = styled.a`
    color: ${vars.orange};
    &:hover {
        color: ${vars.orange};
        cursor: pointer;
    }
`
export const CustomTr = styled.tr`
    background: ${props => props.acceptState ? 
        ('#ebffeb') : (props.wrongState && '#ffebeb')
    };
`
export const Name = styled.a`
    color: ${props => {
        if (props.score >= 2000) {
            return vars.grandmaster
        } else if (props.score >= 1800) {
            return vars.master 
        } else {
            return vars.regular
        }
    }}!important;
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
