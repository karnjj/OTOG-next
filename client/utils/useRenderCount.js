import { useRef } from 'react'

export default (name) => {
	const count = useRef(0)
	console.log(`${name} rendered : ${++count.current} `)
}
