import { useAuthContext } from '../utils/auth'

import { Popover, OverlayTrigger, Row, Col } from 'react-bootstrap'
import { CustomTr, CustomTable } from './CustomTable'

import SubmitGroup from './SubmitGroup'
import ViewCodeButton from './ViewCodeButton'
import styled from 'styled-components'

const StyledPop = styled(Popover)`
	max-width: none;
`

const ProbTable = ({ problems }) => {
	const userData = useAuthContext()
	return (
		<CustomTable ready={problems !== undefined}>
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Passed</th>
					<th>Ratings</th>
					{userData && <th>Submit</th>}
				</tr>
			</thead>
			<tbody>
				{problems &&
					problems.map((prob, index) => <ProbTr key={index} {...prob} />)}
			</tbody>
		</CustomTable>
	)
}

const ProbTr = (props) => {
	const {
		id_Prob,
		name,
		time,
		memory,
		sname,
		rating,
		pass,
		acceptState,
		wrongState,
	} = props
	const userData = useAuthContext()

	const passed = []
	if (pass) {
		for (let i = 0; i < pass.length; i += 15) {
			passed.push(pass.slice(i, i + 15))
		}
	}
	return (
		<CustomTr {...{ acceptState, wrongState }}>
			<td>{id_Prob}</td>
			<td>
				<a target='_blank' href={`${process.env.API_URL}/api/docs/${sname}`}>
					{name}
					<br />({time} วินาที {memory} MB)
				</a>
			</td>
			<td>
				{pass ? (
					<OverlayTrigger
						placement='top'
						overlay={
							<StyledPop>
								<Popover.Content as={Row}>
									{passed.map((names, i) => (
										<Col key={i}>
											{names.map((name, j) => (
												<div key={j}>• {name}</div>
											))}
										</Col>
									))}
								</Popover.Content>
							</StyledPop>
						}
					>
						<a>{pass.length}</a>
					</OverlayTrigger>
				) : (
					<>0</>
				)}
			</td>
			<td>{(rating ? rating : '-')}</td>
			{userData && (
				<td>
					<SubmitGroup {...props}>
						{(acceptState || wrongState) && <ViewCodeButton {...{ id_Prob }} />}
					</SubmitGroup>
				</td>
			)}
		</CustomTr>
	)
}

export default ProbTable
