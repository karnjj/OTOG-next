import { useRouter } from 'next/router'
import { withAuthSync } from '../../utils/auth'

import ViewCodeButton from '../../components/ViewCodeButton'
import SubmitGroup from '../../components/SubmitGroup'
import DownloadButton from '../../components/DownloadButton'

import styled from 'styled-components'

const Iframe = styled.iframe`
    display: block;
    background: #000;
    border: none; 
    height: 100vh;
    width: 100vw;
`
const StyledTool = styled.div`
    position: fixed;
    right: 30px;
    top: 60px;
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`
const OpenPDF = (props) => {
    const { id_Prob, userData, acceptState, wrongState } = props
    const router = useRouter()
    const { name } = router.query
    const url = `${process.env.API_URL}/api/docs/${name}`

    return (
        <>
            <StyledTool>
                <SubmitGroup prob={{name}}/>
                {(acceptState || wrongState) && <ViewCodeButton/>}
                <DownloadButton/>
            </StyledTool>
            <Iframe src={url} type='application/pdf'/>
        </>
    )
}
export default withAuthSync(OpenPDF)