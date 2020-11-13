import React, { useRef, useCallback } from 'react'
import { Container } from 'react-bootstrap'
import Measure from 'react-measure'
import { useOnScreen } from '../utils'

const heightCache = {}

const RenderOnIntersect = ({ id, initialHeight, as, children }) => {
  const dummyBoxRef = useRef()
  const [intersecting] = useOnScreen(dummyBoxRef, '200px', false)

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
    <Container
      fluid
      as={as}
      ref={dummyBoxRef}
      style={{ height: heightCache[id] || initialHeight }}
    />
  )
}

export { RenderOnIntersect }
