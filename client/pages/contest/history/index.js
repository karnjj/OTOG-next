import { Title } from '../../../components/CustomText'
import PageLayout from '../../../components/PageLayout'
import { CustomTable, TableRow } from '../../../components/CustomTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faChartArea } from '@fortawesome/free-solid-svg-icons'

import OrangeButton from '../../../components/OrangeButton'
import { useGet } from '../../../utils/api'

const ContestTr = (props) => {
  const { idContest, name, time_start, time_end, mode_grader, judge } = props
  const now = new Date()
  const start = new Date(Number(time_start * 1000))
  const PascalCase = (str) => str[0].toUpperCase() + str.slice(1)
  const difftime = (timestamp) => {
    timestamp = Math.floor(timestamp / 60)
    var int_hours = Math.floor(timestamp / 60)
    var hours = int_hours.toString()
    var minutes = (timestamp % 60).toString()
    if (hours.length == 1) hours = '0' + hours
    if (minutes.length == 1) minutes = '0' + minutes
    if (int_hours > 23) return Math.floor(int_hours / 24).toString() + ' days'
    else return hours + ':' + minutes
  }
  return (
    <TableRow>
      <td>{idContest}</td>
      <td>{name}</td>
      <td>{start.toLocaleString('th-TH')}</td>
      <td>{difftime(time_end - time_start)}</td>
      <td>{`${PascalCase(mode_grader)} (${PascalCase(judge)})`}</td>
      <td>
        {time_end < now.valueOf() && (
          <OrangeButton
            expand={4}
            variant='outline-primary'
            href='/contest/history/[id]'
            dynamic={`/contest/history/${idContest}`}
          >
            <FontAwesomeIcon icon={faChartArea} />
          </OrangeButton>
        )}
      </td>
    </TableRow>
  )
}

const ContestTable = () => {
  const {
    data: { contests },
  } = useGet('/api/contest/history')

  return (
    <CustomTable ready={!!contests}>
      <thead>
        <tr>
          <th>#</th>
          <th>Contest Name</th>
          <th>Start</th>
          <th>Length</th>
          <th>Mode</th>
          <th>Scoreboard</th>
        </tr>
      </thead>
      <tbody>
        {contests?.map((con, index) => (
          <ContestTr key={index} {...con} />
        ))}
      </tbody>
    </CustomTable>
  )
}

const History = () => (
  <PageLayout>
    <Title icon={faTrophy} text='Contest History' />
    <hr />
    <ContestTable />
  </PageLayout>
)

export default History
