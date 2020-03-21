import { useState, useEffect } from 'react'
import { useAuthContext } from '../utils/auth'

import styled from 'styled-components'
import vars from '../styles/vars'

import CountUp from 'react-countup'
import { lighten } from 'polished'

const WelcomeText = styled.h4`
    color: ${vars.black};
    text-align: center;
`
const AliveText = styled.h6`
    color: ${vars.black};
    text-align: center;
    font-weight: bold;
`
const Number = styled(CountUp)`
    color: ${vars.white};
    font-family: Calibri;
    font-size: 50px;
    margin-top:-5px;
    font-weight:100;
    text-align: center;
`
const Message = styled.h5`
    color: ${vars.white};
    font-family: Calibri;
    font-size: 15px;
    margin-top:10px;
    margin-bottom:0px;
    font-weight:600;
    text-align: center;
`
const ButtonWrapper = styled.ul`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
`
const CountButton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    background: ${props => lighten(0.05, props.color)};
    box-shadow: 0 5px ${vars.btn_gray};
    border-radius: 1rem;
    width: 128px;
    height: 95px;
    padding: 20px;
    margin: 6px 3px;
    transition: background-color 0.1s;
    &:hover {
        background: ${props => lighten(0.08, props.color)};
    }
    &:active {
        background: ${props => props.color};
        transform: translateY(3px);
        box-shadow: 0 2px ${vars.btn_gray};
    }
`

const Hello = () => {
    const userData = useAuthContext()
    const [allProb,setAllProb] = useState(0)
    const [passProb,setPassProb] = useState(0)
    const [wrongProb,setWrongProb] = useState(0)
    const [noSub,setNoSub] = useState(0)
    const [newProb, setNewProb] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            let url = `${process.env.API_URL}/api/countProblem`
            let headers = { "Content-Type": "application/json" }
            headers["Authorization"] = userData.id;
            const response = await fetch(url, { headers, })
            const { allProblem, userProblem } = await response.json()
            const { passProb, wrongProb } = userProblem
            setAllProb(allProblem)
            setPassProb(passProb)
            setWrongProb(wrongProb)
            setNoSub(allProblem - passProb - wrongProb)
            setNewProb(0)
        }
        fetchData()
    }, [])
    return (
        <>
            <WelcomeText>สวัสดี {userData.sname}</WelcomeText>
            <ButtonWrapper>
            {[  //message,  number,     color
                ['ทั้งหมด',   allProb,    vars.btn_black],
                ['ผ่านแล้ว',  passProb,   vars.btn_green],
                ['ยังไม่ผ่าน', wrongProb,  vars.btn_red],
                ['ยังไม่ส่ง',  noSub,      vars.btn_orng],
                ['โจทย์วันนี้', newProb,    vars.btn_blue],
            ].map(([ message, number, color ], index) => (
                <CountButton {...{color}} key={index}>
                    <Message>{message}</Message>
                    <Number end={number}/>
                </CountButton>
            ))}
            </ButtonWrapper>
            <AliveText>ยังมีชีวิตรอด : {0}</AliveText>
        </>
    )
}
export default Hello