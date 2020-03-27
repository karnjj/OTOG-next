const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router()
const logger = require('morgan');
const users = require('./users')
const problems = require('./problems')
const contest = require('./contest')
const submission = require('./submissions')
const admin = require('./admin')
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(logger('dev'));

router.get('/', (req, res) => {
  res.send('OTOG API Service')
})

//Users
router.post('/login',users.login)
router.post('/register',users.register)
router.get('/logout',users.logout)
router.get('/auth',users.auth)
router.get('/user',users.getUser)
router.post('/upload/:id', users.multerConfig.single('file'), users.uploadFie)
router.get('/scode', users.viewSouceCode)
//Problem
router.get('/problem',problems.getProblem )
router.get('/countProblem', problems.cntProblem)
router.get('/docs/:name', problems.getDoc)
//Submission
router.get('/submission', submission.AllSubmission)
//Contest
router.get('/contest/history',contest.getAllContest )
router.get('/contest/:id', contest.getContestWithId)
router.get('/contest/history/:idContest', contest.getContestHistoryWithId)
router.get('/contest/:id/submission', contest.getContestSubmissionWithId)
//Admin
router.get('/admin/problem', admin.Problems)
router.get('/admin/user', admin.Users)
router.post('/admin/user/:id', admin.editUser)
router.post('/admin/problem/:id', admin.editProblem)
module.exports = router