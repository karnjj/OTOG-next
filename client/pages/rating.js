import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch'
import { withAuthSync } from '../utils/auth'
import UserTable from '../components/UserTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar } from '@fortawesome/free-solid-svg-icons'
const Rating = (props) => {
    const [userState, setUserState] = useState([])
    const [searchState, setsearchState] = useState('')
    useEffect(() => {
        const fetchData = async () => {
            const url = `${process.env.API_URL}/api/user`
            const res = await fetch(url)
            const json = await res.json()
            setUserState(json)
        }
        fetchData()
    },[])
    const updateSearch = (event) => {
        setsearchState(event.target.value.substr(0, 20))
    }
    let filteredUser = userState.filter((user) => {
        return (user.sname.indexOf(searchState)!==-1)
    })
    return (
        <>
            <br /><br className="d-none d-md-block" /><br className="d-none d-lg-block" />
            <div className="container">
                <h2><FontAwesomeIcon icon={faChartBar} /> Rating </h2><br />
                <div className="container row align-items-baseline">
                    <label className="col-md-2 text-nowrap"><b>ค้นหาผู้ใช้ : </b></label>
                    <input className="col-md-6 form-control" placeholder="ค้นหาผู้ใช้" 
                        value={searchState}
                        onChange={updateSearch}/>
                    <div className="col-md-4"></div>
                </div>
                <hr/>
                <UserTable user={filteredUser}/>
            </div>
        </>
    )
}
export default withAuthSync(Rating)