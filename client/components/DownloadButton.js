import OrangeButton from './OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

const DownloadButton = (props) => (
    <OrangeButton target='_blank' href={`${process.env.API_URL}/api/docs/${props.sname}`} download>
        <FontAwesomeIcon icon={faDownload}/>
    </OrangeButton>
)

export default DownloadButton
