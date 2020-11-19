import { useState, useCallback, useRef, useEffect } from 'react'

export const useInput = (initialValue = '', converter) => {
  const [value, setValue] = useState(initialValue)
  const convert = useCallback(converter ?? ((val) => val), [converter])
  const onChange = useCallback(
    (event) => setValue(convert(event.target.value)),
    [convert]
  )
  return [value, { value, onChange }, setValue]
}

export const useForm = (defaultValue) => {
  const [data, setData] = useState(defaultValue)
  const onValueChange = useCallback(({ target }) => {
    setData((prevData) => ({ ...prevData, [target.name]: target.value }))
  }, [])
  const onCheckChange = useCallback(({ target }) => {
    setData((prevData) => ({ ...prevData, [target.name]: target.check }))
  }, [])
  const onFileChange = useCallback(({ target }) => {
    setData((prevData) => ({ ...prevData, [target.name]: target.files[0] }))
  }, [])
  return { data, onValueChange, onCheckChange, onFileChange, setData }
}

export const useShow = (initialState = false) => {
  const [show, setShow] = useState(initialState)
  const handleShow = useCallback(() => setShow(true), [])
  const handleClose = useCallback(() => setShow(false), [])
  const shown = useRef(initialState)
  if (show && !shown.current) {
    shown.current = true
  }
  return [show, handleShow, handleClose, shown.current]
}

export const useFocus = () => {
  const focusRef = useRef(null)
  useEffect(() => {
    if (focusRef) {
      focusRef.current.focus()
    }
  }, [focusRef])
  return { ref: focusRef, autoFocus: true }
}

export const useAlert = (initialMessages = { head: '', desc: '' }) => {
  const [alert, setMessages] = useState({ show: false, ...initialMessages })
  const setAlert = useCallback((messages) => {
    setMessages({ ...messages, show: true })
  }, [])
  const handleClose = useCallback(() => {
    setMessages((prevMessages) => ({ ...prevMessages, show: false }))
  }, [])
  return [{ handleClose, ...alert }, setAlert]
}

export const range = (n) => [...Array(n).keys()]

export const timeToString = (time) =>
  new Date(time * 1000).toLocaleString('th-TH')

export const useRenderCount = (name) => {
  const count = useRef(0)
  console.log(`${name} rendered : ${++count.current} `)
}

export const useOnScreen = (rootMargin = '0px') => {
  const [isIntersecting, setIntersecting] = useState(false)
  const resetIntersecting = useCallback(() => setIntersecting(false), [])

  const [observer] = useState(
    () =>
      new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting),
        { rootMargin, threshold: 0 }
      )
  )

  const ref = useCallback(
    (node) => {
      if (observer) {
        observer.disconnect()
        if (node) {
          observer.observe(node)
        }
      }
    },
    [observer]
  )

  return [ref, isIntersecting, resetIntersecting]
}
