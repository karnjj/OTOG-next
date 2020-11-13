import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../utils/auth'
import { useGet } from '../utils/api'

import { Row, Col, Form } from 'react-bootstrap'

import { Title } from '../components/CustomText'
import PageLayout from '../components/PageLayout'
import OrangeButton from '../components/OrangeButton'
import SubmissionTable from '../components/SubmissionTable'
import SubmitGroup from '../components/SubmitGroup'

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
import Loader from '../components/Loader'
import { useOnScreen } from '../utils'

const Submission = () => {
  const { isLogin, isAdmin } = useAuthContext()
  const [showOnlyMe, setShowOnlyMe] = useState(!isAdmin && isLogin)
  useEffect(() => setShowOnlyMe(!isAdmin && isLogin), [isAdmin, isLogin])

  const url = `/api/submission?mode=${showOnlyMe ? 'onlyme' : 'full'}`
  const {
    data: { results, latest },
    isLoading,
    isValidating,
    mutate,
  } = useGet(url)

  //switch reload effect
  const [loading, setLoading] = useState(isLoading)
  useEffect(() => {
    if (!isLoading) {
      setLoading(false)
    }
  }, [isValidating])

  const handleCheck = (event) => {
    setShowOnlyMe(event.target.checked)
    setLoading(true)
  }

  const loaderRef = useRef()
  const loadMore = useOnScreen(loaderRef)
  console.log(loadMore)
  useEffect(() => {
    if (loadMore) {
      mutate(url, async ({ results, latest }) => {
        const lastId = results[results.length - 1].idResult
        const olderResults = await httpGet(`${url}&last=${lastId}`)
        return { results: [...results, ...olderResults], latest }
      })
    }
  }, [loadMore, url])

  return (
    <>
      <Row className='align-items-baseline'>
        <Col
          xs={{ span: 12, order: 'last' }}
          lg={{ span: 6, order: 'first' }}
          className='mt-2 mt-lg-0'
        >
          {latest && (showOnlyMe || isAdmin) && (
            <Row className='align-items-baseline'>
              <Col xs='auto' className='ml-auto ml-lg-0'>
                <b>ส่งข้อล่าสุด :</b>
              </Col>
              <Col
                xs='auto'
                style={{
                  maxWidth: '195px',
                }}
              >
                <a
                  target='_blank'
                  className='text-wrap'
                  href={`${process.env.API_URL}/api/docs/${latest.sname}`}
                >
                  {latest.name}
                </a>
              </Col>
              <Col xs='auto'>
                <SubmitGroup {...latest} />
              </Col>
            </Row>
          )}
        </Col>
        <Col xs lg='auto' className='ml-auto'>
          {isLogin && (
            <Form.Check
              type='switch'
              id='custom-switch'
              label='แสดงเฉพาะฉัน'
              checked={showOnlyMe}
              onChange={handleCheck}
            />
          )}
        </Col>
        <Col xs sm={5} md={4} lg={3} xl={2}>
          <OrangeButton href='task' className='w-100'>
            View Tasks
          </OrangeButton>
        </Col>
      </Row>
      <hr />
      <SubmissionTable
        isLoading={loading}
        canViewCode={showOnlyMe}
        results={results}
      />
      <Loader ref={loaderRef} />
    </>
  )
}

const SubmissionPage = () => {
  return (
    <PageLayout>
      <Title icon={faPuzzlePiece} text='Submissions' />
      <Submission />
    </PageLayout>
  )
}

export default SubmissionPage
