import { Row, Col } from 'react-bootstrap'
import { Alink } from '../components/CustomText'
import { range } from '../utils/array'

export default (props) => (
	<>
		{range(props.br).map((i) => (
			<br key={i} />
		))}
		<hr />
		<Row sm={1} className='mb-3'>
			<Col md='auto' className='mr-auto'>
				If you have any problem or suggestion, please{' '}
				<Alink href='https://fb.me/kkuotog' target='_blank'>
					Contact Us
				</Alink>
			</Col>
			<Col md='auto'>&copy; 2019 Phakphum Dev Team</Col>
		</Row>
	</>
)
