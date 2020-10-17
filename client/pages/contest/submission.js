import { withAdminAuth } from '../../utils/auth'

import { Title } from '../../components/CustomText'
import PageLayout from '../../components/PageLayout'
import OrangeButton from '../../components/OrangeButton'
import SubmissionTable from '../../components/SubmissionTable'

import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { useGet } from '../../utils/api'

const Submission = () => {
  const {
    data: { results },
    isLoading,
  } = useGet('/api/contest/submission')
  return <SubmissionTable results={results} isLoading={isLoading} />
}

const ContestSubmissionPage = () => (
  <PageLayout>
    <Title icon={faTrophy} text='Contest Submissions' noBot='true'>
      <OrangeButton href='/contest'>View Contest</OrangeButton>
    </Title>
    <hr />
    <Submission />
  </PageLayout>
)

export default withAdminAuth(ContestSubmissionPage)
