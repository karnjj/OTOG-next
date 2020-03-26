import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col } from 'react-bootstrap'

export default ({ icon, noBot, noTop, title, children }) => (
	<>
		{!noTop && (
			<>
				<br />
				<br />
				<br />
			</>
		)}
		<Row>
			<Col className='mr-auto'>
				<h2>
					<FontAwesomeIcon icon={icon} /> {title}
				</h2>
			</Col>
			<Col xs='auto'>{children}</Col>
		</Row>
		{!noBot && <br />}
	</>
)
