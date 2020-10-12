import { withAdminAuth } from '../../utils/auth'

import { Title } from '../../components/CustomText'
import PageLayout from '../../components/PageLayout'
import OrangeButton from '../../components/OrangeButton'
import SubmissionTable from '../../components/SubmissionTable'

import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { useGet } from '../../utils/api'

const Submission = () => {
  const { data = {} } = useGet('/api/contest/submission')
  const { result: results } = data

  return (
    <PageLayout>
      <Title icon={faTrophy} text='Contest Submissions' noBot='true'>
        <OrangeButton href='/contest'>View Contest</OrangeButton>
      </Title>
      <hr />
      <SubmissionTable results={results} />
    </PageLayout>
  )
}

export default withAdminAuth(Submission)
