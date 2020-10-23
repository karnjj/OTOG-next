import React, { useCallback, useEffect, useMemo, useState } from 'react'

import isHotkey from 'is-hotkey'
import { createEditor, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'

import { Button, Modal, ButtonGroup, ButtonToolbar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencilAlt,
  faBold,
  faItalic,
  faUnderline,
  faLink,
  faCode,
  faHeading,
  faQuoteLeft,
  faListOl,
  faListUl,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { useShow } from '../utils'
import { usePut } from '../utils/api'
import { Alink } from './CustomText'

const Blockquote = styled.blockquote`
  padding-left: 10px;
  border-left: 2px solid #ddd;
  color: #999;
`
const Code = styled.code`
  background: #eee;
  color: #000;
  font-family: 'Fira Code', monospace, 'Courier New', Courier;
`

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.link) {
    children = (
      <a target='_blank' href={leaf.text}>
        {children}
      </a>
    )
  }
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.code) {
    children = <Code>{children}</Code>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underline) {
    children = <u>{children}</u>
  }
  return <span {...attributes}>{children}</span>
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <Blockquote className='blockquote' {...attributes}>
          {children}
        </Blockquote>
      )
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const toggleMark = (editor, format) => {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  })
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })
  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  })
  return !!match
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      style={{ minWidth: '32px' }}
      size='sm'
      variant='outline-secondary'
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  )
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      style={{ minWidth: '32px' }}
      size='sm'
      variant='outline-secondary'
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  )
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const emptyAnnounce = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export const AnnounceEditor = ({ idContest, announce }) => {
  const [show, handleShow, handleClose] = useShow()
  const [value, setValue] = useState(emptyAnnounce)
  useEffect(() => {
    if (!!announce) {
      setValue(announce)
    } else {
      setValue(emptyAnnounce)
    }
  }, [announce])

  const [isPending, setPending] = useState(false)
  const put = usePut(`/api/admin/contest/${idContest}`)
  const onSave = async () => {
    setPending(true)
    const response = await put(JSON.stringify(value))
    if (response.ok) {
      handleClose()
      setPending(false)
    }
  }

  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const handleHotkey = (event) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault()
        const mark = HOTKEYS[hotkey]
        toggleMark(editor, mark)
      }
    }
    if (isHotkey('shift+return', event)) {
      event.preventDefault()
      editor.insertText('\n')
    }
  }

  return (
    <>
      <Button variant='info' onClick={handleShow} disabled={idContest === 0}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contest #{idContest}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          >
            <ButtonToolbar>
              <ButtonGroup className='mr-2'>
                <MarkButton format='bold' icon={faBold} />
                <MarkButton format='italic' icon={faItalic} />
                <MarkButton format='underline' icon={faUnderline} />
                <MarkButton format='link' icon={faLink} />
                <MarkButton format='code' icon={faCode} />
              </ButtonGroup>
              <ButtonGroup className='mr-2'>
                <BlockButton format='heading-one' icon={faHeading} />
                <BlockButton format='block-quote' icon={faQuoteLeft} />
                <BlockButton format='numbered-list' icon={faListOl} />
                <BlockButton format='bulleted-list' icon={faListUl} />
              </ButtonGroup>
            </ButtonToolbar>
            <hr />
            <Editable
              placeholder='Enter contest description…'
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={handleHotkey}
              autoFocus
            />
          </Slate>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='success' onClick={onSave} disabled={isPending}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const BAKA = [
  { type: 'heading-one', children: [{ text: 'SNIS-1234' }] },
  {
    type: 'paragraph',
    children: [
      { text: 'Welcome to ' },
      { text: 'the world', code: true },
      { text: ' !' },
    ],
  },
  {
    type: 'bulleted-list',
    children: [
      { type: 'list-item', children: [{ text: '1 2 3' }] },
      { type: 'list-item', children: [{ text: '4 5 6' }] },
      { type: 'list-item', children: [{ text: '7 8 9' }] },
    ],
  },
  { type: 'block-quote', children: [{ text: 'Baka ! Hentai ' }] },
  {
    type: 'paragraph',
    children: [
      { text: 'https://otog.cf/contest', underline: true, link: true },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '', underline: true, link: true }],
  },
]

const Announce = ({ value = BAKA, idContest, children }) => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [show, handleShow, handleClose] = useShow()
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  return (
    <>
      <Alink onClick={handleShow}>{children}</Alink>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contest #{idContest}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Slate value={value} editor={editor}>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              readOnly
            />
          </Slate>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Announce

// ************Old Announce******************
// const Announce = styled.div`
// 	position: absolute;
// 	text-align: center;
// 	cursor: pointer;
// 	user-select: none;
// 	opacity: ${(props) => (props.show || props.unshow ? 1 : 0)};
// 	animation: ${(props) => (props.show ? popin : props.unshow && popout)} 0.4s
// 		ease both;
// `
// const StyledAnnouncement = styled(Container)`
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	min-height: 150px;
// `
// const Announcement = () => {
// 	const [messages, setMessages] = useState([
// 		'ญินดีร์ฏ้อณลับสูเก็ดเฎอร์ฌาวไฑย',
// 		'จงทำโจทย์ !!!',
// 		'คิดถึงน้อง ๆ จัง',
// 	])
// 	const [currentIndex, setCurrentIndex] = useState(0)
// 	const handleClick = () => {
// 		setCurrentIndex((currentIndex + 1) % messages.length)
// 	}
// 	const previousIndex = (currentIndex - 1 + messages.length) % messages.length
// 	return (
// 		<StyledAnnouncement>
// 			{messages.map((message, index) => (
// 				<Announce
// 					key={index}
// 					show={index === currentIndex}
// 					unshow={index === previousIndex}
// 					onClick={handleClick}
// 				>
// 					<h1>{message}</h1>
// 				</Announce>
// 			))}
// 		</StyledAnnouncement>
// 	)
// }
