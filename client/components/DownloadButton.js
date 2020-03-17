import OrangeButton from './OrangeButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

const DownloadButton = (props) => (
    <OrangeButton href={`doc/${props.id}`} download>
        <FontAwesomeIcon icon={faDownload}/>
    </OrangeButton>
)

export default DownloadButton
