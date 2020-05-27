import { useState, useEffect } from 'react'
import styled from 'styled-components'

const StyledTimer = styled.div`
	display: inline-block;
`

const Timer = ({ timeLeft, mode, ...props }) => {
	const [timeState, setTimeState] = useState({})
	var TimeLeft = timeLeft
	var timer = 0

	useEffect(() => {
		setTimeState(secondsToTime(TimeLeft))
		if (timer == 0 && TimeLeft > 0) {
			timer = setInterval(countdown, 1000)
		}
		return function cleanup() {
			clearInterval(timer)
		}
	}, [])

	const secondsToTime = (secs) => {
		let hour = Math.floor(secs / (60 * 60))
		let minuteDivisor = secs % (60 * 60)
		let minute = Math.floor(minuteDivisor / 60)
		let secondsDivisor = minuteDivisor % 60
		let second = Math.ceil(secondsDivisor)
		let time = {
			h: hour,
			m: minute,
			s: second,
		}
		return time
	}
	const countdown = () => {
		TimeLeft-- 
		setTimeState(secondsToTime(TimeLeft))
		if (TimeLeft <= 0) {
			clearInterval(timer)
			window.location.reload(false)
		}
	}
	const thCountdown = (timeState) => {
		const h = `${timeState.h} ชั่วโมง `
		const m = `${timeState.m} นาที `
		const s = `${timeState.s} วินาที `
		if (timeState.h) {
			if (timeState.m) {
				return h + m + s
			}
			return h + s
		} else if (timeState.m) {
			return m + s
		} else if (timeState.s) {
			return s
		}
	}
	return mode === 'th' ? (
		<StyledTimer {...props}>{thCountdown(timeState)}</StyledTimer>
	) : (
		<StyledTimer {...props}>
			{timeState.h} h : {timeState.m} m : {timeState.s} s
		</StyledTimer>
	)
}
export default Timer
