import React, { useState, useEffect } from 'react';
import Header from '../components/Header'
import fetch from 'isomorphic-unfetch'
import App from '../components/App'
import { withAuthSync } from '../utils/auth'
import UserTable from '../components/UserTable';
const Rating = (props) => {
    const userData = props.jsData
    const [userState, setUserState] = useState([])
    const [searchState, setsearchState] = useState('')
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8000/api/user')
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
        <App>
            <Header userData={userData} />
            <br /><br class="d-none d-md-block" /><br class="d-none d-lg-block" />
            <div class="container">
                <h2><i class="fa fa-bar-chart"></i> Rating </h2><br />
                <div class="container row align-items-baseline">
                    <label class="col-md-2 text-nowrap"><b>ค้นหาผู้ใช้ : </b></label>
                    <input class="col-md-6 form-control" placeholder="ค้นหาผู้ใช้" 
                        value={searchState}
                        onChange={updateSearch}/>
                    <div class="col-md-4"></div>
                </div>
                <hr />
                < UserTable user={filteredUser}/>
            </div>
        </App>
    )
}
export default withAuthSync(Rating)