import { Row, Col } from 'react-bootstrap'
import styled from 'styled-components'
import vars from '../styles/vars'

const Link = styled.a`
	color: ${vars.orange};
	&:hover {
		color: ${vars.orange};
	}
`
const Text = styled.p`
	text-align: right;
`

const Footer = () => (
	<>
		<hr />
		<Row>
			<Col md={6}>
				If you have any problem or suggestion, please{' '}
				<Link href='#'>Contact Us</Link>
			</Col>
			<Col as={Text} md={6}>
				&copy; 2019 Phakphum Dev Team
			</Col>
		</Row>
	</>
)

export default Footer
