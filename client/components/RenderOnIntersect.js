import React, { useState, useRef, useEffect, useCallback } from 'react'
import Measure from 'react-measure'

const heightCache = {}

const RenderOnIntersect = ({ id, initialHeight, children }) => {
  const [intersecting, setIntersecting] = useState(false)
  const dummyBoxRef = useRef()

  useEffect(() => {
    if (intersecting) {
      return
    }

    const options = {
      rootMargin: '500px',
      threshold: 0,
    }

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        setIntersecting(true)
      }
    }

    const target = dummyBoxRef.current
    const observer = new IntersectionObserver(callback, options)
    observer.observe(target)

    return () => observer.unobserve(target)
  }, [intersecting])

  const onResize = useCallback(
    (contentRect) => {
      heightCache[id] = contentRect.bounds.height
    },
    [id]
  )

  return intersecting ? (
    <Measure bounds onResize={onResize}>
      {({ measureRef }) =>
        React.cloneElement(children, {
          ref: measureRef,
        })
      }
    </Measure>
  ) : (
    <div
      ref={dummyBoxRef}
      style={{ height: heightCache[id] || initialHeight }}
    />
  )
}

export { RenderOnIntersect }
