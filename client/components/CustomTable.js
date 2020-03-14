import { Table } from 'react-bootstrap'
import styled from 'styled-components'
import vars from '../styles/vars'

export const CustomTr = styled.tr`
    background: ${props => props.accept ? '#ebffeb' : props.wrong && '#ffebeb'};
`
const CenterTable = styled(Table)`
    text-align: center;
    th, a {
        color: ${vars.orange};
    }
`
export const CustomTable = ({ children }) => (
    <CenterTable responsive hover>
        {children}
    </CenterTable>
)
