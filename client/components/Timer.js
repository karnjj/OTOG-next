import { useState, useEffect } from "react";
const Timer = ({ CountTo }) => {
    const [timeState, setTimeState] = useState({})
    var timer = 0;
    useEffect(() => {
        let timeNow = Math.floor((Date.now()) / 1000)
        let seconds = CountTo - timeNow;
        let timeleft = secondsToTime(seconds);
        setTimeState(timeleft)
        if (timer == 0 && CountTo > 0) {
            timer = setInterval(countdown, 1000);
        }
    }, [])
    const secondsToTime = secs => {
        let hour = Math.floor(secs / (60 * 60));
        let minuteDivisor = secs % (60 * 60);
        let minute = Math.floor(minuteDivisor / 60);
        let secondsDivisor = minuteDivisor % 60;
        let second = Math.ceil(secondsDivisor);
        let time = {
            "h": hour,
            "m": minute,
            "s": second
        };
        return time;
    }
    const countdown = () => {
        let timeNow = Math.floor((Date.now()) / 1000)
        let seconds = CountTo - timeNow;
        setTimeState(secondsToTime(seconds))
        if (seconds <= 0) {
            clearInterval(timer);
        }
    }
    return (
        <div>
            {timeState.h} hr : {timeState.m} m : {timeState.s} s
        </div>
    )
}
export default Timer