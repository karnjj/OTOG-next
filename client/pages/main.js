import Router from 'next/router'
import { useEffect } from 'react'

const Main = () => {
	useEffect(() => {
		Router.push('/')
	}, [])
	return null
}

export default Main
