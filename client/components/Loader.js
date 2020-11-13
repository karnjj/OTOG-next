import { forwardRef } from 'react'
import { Spinner, Row, Table } from 'react-bootstrap'
import styled, { keyframes } from 'styled-components'
import { darken } from 'polished'
import vars from '../styles/vars'
import { range } from '../utils'

const pulse = keyframes`
	0% {
		opacity: 0.3;
	}
	25% {
		opacity: 1;
	}
	50% {
		opacity: 0.3;
	}
`
const Text = styled.div`
  height: 16px;
  max-width: 160px;
  background: ${darken(0.03, vars.grey)};
  opacity: 0.3;
  animation: ${pulse} 1s ease ${(props) => props.delay + 500 + 'ms'} infinite;
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
export const Loader = forwardRef((_, ref) => (
  <Row className='justify-content-center py-5'>
    <Spinner ref={ref} variant='primary' animation='border' role='status'>
      <span className='sr-only'>Loading...</span>
    </Spinner>
  </Row>
))

export const TableLoader = () => {
  return (
    <AnimationTable responsive>
      <thead>
        <tr>
          {range(5).map((i) => (
            <th key={i}>
              <Text delay={i * 20} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {range(5).map((i) => (
          <tr key={i}>
            {range(5).map((j) => (
              <td key={j}>
                <Text delay={j * 20 + (i + 1) * 100} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </AnimationTable>
  )
}

export default Loader
