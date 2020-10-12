import { Alert } from 'react-bootstrap'
import styled, { keyframes } from 'styled-components'

const dropin = keyframes`
	0% {
		opacity: 0;
		transform: translateY(-10px);
	}
	100% {
		opacity: 1;
		transform: translateY(0px);
	}
`

const AlertContainer = styled.div`
  position: fixed;
  top: 0;
  margin: 10px auto;
  .fade-in {
    animation: ${dropin} 0.5s ease;
  }
  .hide {
    display: none;
  }
  .alert {
    width: 350px;
  }
`

const CustomAlert = ({ head, desc, show, handleClose }) => {
  return (
    <AlertContainer>
      <Alert
        variant='danger'
        className={show ? 'fade-in' : 'hide'}
        onClose={handleClose}
        dismissible
      >
        <strong>{head}</strong>
        <br />
        {desc}
      </Alert>
    </AlertContainer>
  )
}

export default CustomAlert
