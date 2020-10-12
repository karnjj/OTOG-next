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
const StyledTable = styled(Table)`
  text-align: ${(props) => props.align};
  th {
    color: ${vars.orange};
    &:hover {
      color: ${vars.orange};
      cursor: pointer;
    }
  }
  tr {
    animation: ${fadein} 0.2s ease;
  }
`
export const CustomTable = ({ ready = true, align = 'center', ...props }) => {
  return ready ? (
    <StyledTable responsive hover align={align} {...props} />
  ) : (
    <TableLoader />
  )
}
