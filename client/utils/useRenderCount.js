import { useRef } from 'react'

const useRenderCount = (name) => {
  const count = useRef(0)
  console.log(`${name} rendered : ${++count.current} `)
}

export default useRenderCount
