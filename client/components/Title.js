import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ icon, noBr, children }) => (
	<>
		<br />
		<br />
		<br />
		<h2>
			<FontAwesomeIcon icon={icon} /> {children}
		</h2>
		{!noBr && <br />}
	</>
)
