import vars from '../styles/vars'
import styled, { keyframes } from 'styled-components'

import { Table } from 'react-bootstrap'

const customColor = (props) =>
  props.acceptState ? vars.accept : props.wrongState && vars.wrong

export const TableRow = styled.tr`
  background: ${customColor};
  &:hover td {
    background: ${vars.hover};
  }
`
export const TableData = styled.td`
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
export const CustomTable = ({
  isLoading = false,
  align = 'center',
  ...props
}) => {
  return isLoading ? (
    <div style={{ height: '80vh' }} />
  ) : (
    <StyledTable responsive hover align={align} {...props} />
  )
}
