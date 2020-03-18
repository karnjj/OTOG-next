import ViewCodeButton from '../../components/ViewCodeButton'
import SubmitGroup from '../../components/SubmitGroup'
import DownloadButton from '../../components/DownloadButton'

import PDFViewer from '../../components/PDFViewer'

const OpenPDF = (props) => {
    const { acceptState, wrongState } = props
    const router = useRouter()
    const { name } = router.query
    const url = `${process.env.API_URL}/api/docs/${name}`
    return (
        <>
            <Iframe src={url} type='application/pdf'/>
            <StyledTool>
                <SubmitGroup prob={{name}}/>
                {(acceptState || wrongState) && <ViewCodeButton/>}
                <DownloadButton/>
            </StyledTool>
        </>
    )
}

export default PDFViewer