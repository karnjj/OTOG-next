import vars from '../styles/vars'
import styled from 'styled-components'

import OrangeButton from './OrangeButton'
import { down } from 'styled-breakpoints'

const Code = styled.code`
	font-weight: bold;
	color: ${props => props.color};
`
const StyledWelcome = styled.div`
	${down('xl')} {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
`

const Welcome = () => (
	<StyledWelcome>
		<h1>
			Welcome to
			<Code color={vars.green}> O</Code>
			<Code color={vars.red}> T</Code>
			<Code color={vars.orange}> O</Code>
			<Code color={vars.blue}> G</Code>
		</h1>
		<h1>Become a god of competitive programming.</h1>
		<h3>Learn how to code and build algorithms efficiently.</h3>
		<br />
		<OrangeButton size='lg' href='register' target='_blank'>
			Sign Up
		</OrangeButton>
	</StyledWelcome>
)

export default Welcome
