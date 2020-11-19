import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../utils/auth'
import { useGet, httpGet } from '../utils/api'

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
  const { isLogin, isAdmin, token } = useAuthContext()
  const isOnlyMe = !isAdmin && isLogin
  const [showOnlyMe, setShowOnlyMe] = useState(isOnlyMe)
  useEffect(() => setShowOnlyMe(isOnlyMe), [isOnlyMe])

  const url = `/api/submission?mode=${showOnlyMe ? 'onlyme' : 'full'}`
  const {
    data: { results, latest, hasMore },
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

  const [loaderRef, loadMore, resetLoadMore] = useOnScreen()
  useEffect(() => {
    if (hasMore && loadMore) {
      mutate(async ({ results }) => {
        const lastId = results[results.length - 1].idResult
        const data = await httpGet(`${url}&last=${lastId}`, { token })
        return { ...data, results: [...results, ...data.results] }
      }, false)
      resetLoadMore()
    }
  }, [loadMore, url, hasMore, token])

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
      {hasMore && <Loader ref={loaderRef} />}
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
