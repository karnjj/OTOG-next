const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router()
const logger = require('morgan');
const middleware = require('../models/middleware')
const users = require('./users')
const problems = require('./problems')
const contest = require('./contest')
const submission = require('./submissions')
const admin = require('./admin')
const cookieParser = require('cookie-parser')
var corsOptions = {
  origin: 'http://localhost:3002',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(cookieParser())
router.use(logger('dev'));
router.use(middleware.JWTAUTH)
router.get('/', (req, res) => {
  res.send('OTOG API Service')
})
//Users
router.get('/profile/:id', users.getUserData)
router.get('/avatar/:id', users.avatar)
router.post('/login', users.login)
router.post('/register', users.register)
router.get('/logout', users.logout)
router.get('/auth', users.auth)
router.get('/user', users.getUser)
router.post('/upload/:id', users.multerConfig.single('file'), users.uploadFie)
router.get('/scode', users.viewSouceCode)
//Problem
router.get('/problem', problems.getProblem)
router.get('/countProblem', problems.cntProblem)
router.get('/docs/:name', problems.getDoc)
//Submission
router.get('/submission', submission.AllSubmission)
router.get('/submission/:id', submission.GetSubmissionWithId)
router.get('/contest/submission',middleware.AdminAuth,submission.ContestSubmission)
//Contest
router.get('/contest', contest.contest)
router.get('/contest/history', contest.getAllContest)
router.get('/contest/:id', contest.getContestWithId)
router.get('/contest/history/:idContest', contest.getContestHistoryWithId)
router.get('/contest/:id/submission', contest.getContestSubmissionWithId)
//Admin
router.get('/admin/problem', middleware.AdminAuth, admin.Problems)
router.post('/admin/problem', admin.multerConfig.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'zip', maxCount: 1 }
]), admin.addProblem)
router.get('/admin/user', middleware.AdminAuth, admin.Users)
router.post('/admin/user', middleware.AdminAuth, admin.addUsers)
router.get('/admin/contest', middleware.AdminAuth, admin.Contests)
router.post('/admin/contest', middleware.AdminAuth, admin.addContest)
router.get('/admin/contest/:id', middleware.AdminAuth, admin.getContestWithId)
router.patch('/admin/contest/:id', middleware.AdminAuth, admin.patchContestConfig)
router.put('/admin/contest/:id', middleware.AdminAuth, admin.contestAnnounce)
router.patch('/admin/contest/:id/:probId', middleware.AdminAuth, admin.contestProblem)
router.post('/admin/user/:id', middleware.AdminAuth, admin.editUser)
router.delete('/admin/user/:id', middleware.AdminAuth, admin.deleteUsers)
router.delete('/admin/user/:id', middleware.AdminAuth, admin.deleteUsers)
router.delete('/admin/problem/:id', middleware.AdminAuth, admin.deleteProblem)
router.post('/admin/problem/:id', admin.multerConfig.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'zip', maxCount: 1 }
]), admin.editProblem)
module.exports = router