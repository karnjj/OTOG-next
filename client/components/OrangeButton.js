import Link from 'next/link'
import styled from 'styled-components'

import { Button } from 'react-bootstrap'

const StyledButton = styled(Button)`
  padding: ${(props) => props.expand && `6px ${6 + props.expand}px`};
  background: ${(props) => props.variant === 'outline-primary' && 'white'};
`

const OrangeButton = ({ href, dynamic, prefetch, ...props }) =>
  href ? (
    <Link href={href} as={dynamic} prefetch={prefetch}>
      <StyledButton variant='primary' {...props} />
    </Link>
  ) : (
    <StyledButton variant='primary' {...props} />
  )

export default OrangeButton
