import React, { useState, useEffect } from 'react';
import cookie from "js-cookie";
import Router from "next/router";
import App from "../components/App";
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { login } from '../utils/auth'
export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const handleChangeUser = (event) => {
        setUsername(event.target.value)
    }
    const handleChangePass = (event) => {
        setPassword(event.target.value)
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        let url = 'http://localhost:8000/api/login'
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            if (response.ok) {
                const token = await response.json()
                login(token)
            } else {
                console.log('Login failed.')
                let error = new Error(response.statusText)
                console.log(error);
                setError(true)
            }
        } catch (error) {
            console.error(
                'You have an error in your code or there are Network issues.',
                error
            )
            throw new Error(error)
        }
    }
    const closeAlert = () => {
        setError(false)
    }
    return (
        <App>
            <div className="container">
                <div className="row">
                    <div className="col-1 col-md-3 col-lg-4"></div>
                    <div id='padding' className="col-10 col-md-6 col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <div className="text-center font-weight-bold"> OTOG - One Tambon One Grader </div>
                            </div>
                            <div className="card-body">
                                {error && <div>
                                    <div className="alert alert-danger alert-dismissible fade show">
                                        <button className="close" onClick={closeAlert}>&times;</button>
                                        <strong>Login Failed!</strong> <br />
                                        Username หรือ Password <br /> ไม่ถูกต้อง
					                </div>
                                </div>}
                                <form className="form-login" onSubmit={handleSubmit}>
                                    <input
                                        className="form-control"
                                        type="username"
                                        name="username"
                                        value={username}
                                        onChange={handleChangeUser}
                                        placeholder="Username" required /> <br />
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handleChangePass}
                                        placeholder="Password" required />
                                    <br /><br />
                                    <button className="btn otogbtn btn-lg btn-block" type="submit">Sign in</button>
                                    <Link href='/register'>
                                        <a className="btn otogbtn btn-lg btn-block" href="/register">Register</a>
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                    <style jsx>
                        {`
                        #padding {
                            padding-top: 125px
                        }
                        `}</style>
                    <div className="col-1 col-md-3 col-lg-4"></div>
                </div>
            </div>
        </App>
    )
}