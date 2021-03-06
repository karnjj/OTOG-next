const db = require('../models/database').Pool
const jwt = require('jsonwebtoken');

var verifyToken = token => {
	try {
		let js = jwt.verify(token, process.env.PUBLIC_KEY, {
			algorithm: "RS256"
		})
		return js
	} catch {
		return false
	}
}

async function getProblem(req,res) {
	const userData = req.user
    let mode = req.query.mode
	let whoPassPromise = new Promise((resolve, reject) => {
		let sql = "select prob_id,GROUP_CONCAT(DISTINCT(sname) SEPARATOR ',') as pass from Result " +
			"inner join User as U on Result.user_id = U.idUser " +
			"where score = 100 and state = 1 group by prob_id"
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	let problemPromise = new Promise((resolve, reject) => {
		let sql = '';
		if (mode == 'firstpage') sql = 'select * from Problem where state = 1 order by see_date desc limit 10'
		else if(mode == 'admin' && userData?.state == 0) sql = 'select * from Problem order by id_Prob desc'
		else sql = 'select * from Problem where state = 1 order by id_Prob desc'
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	let PassOrWrongPromise = new Promise((resolve, reject) => {
		let sql = `select R1.prob_id,score from (select user_id,prob_id,max(time) 
			as lastest from Result where user_id = ? group by prob_id) as R1 
			inner join Result as R2 on R1.lastest = R2.time and R1.prob_id = R2.prob_id 
			and R1.user_id = R2.user_id`
		db.query(sql, [userData?.id], (err, result) => err ? reject(err) : resolve(result))
	})
	const promiseValue = [whoPassPromise, problemPromise]
	if (userData) promiseValue.push(PassOrWrongPromise)
	Promise.all(promiseValue).then(result => {
		let whoPass = result[0]
		let tasks = result[1]
		let answer = result[2]
		if (answer !== undefined) {
			answer.map((data) => {
				let idx = tasks.findIndex(obj => obj.id_Prob == Number(data.prob_id))
				if (idx !== -1) if (data.score === 100) tasks[idx]['acceptState'] = true
				else tasks[idx]['wrongState'] = true
			})
		}
		for (let key in whoPass) {
			let idx = tasks.findIndex(obj => obj.id_Prob == whoPass[key].prob_id)
			if (idx == -1) continue
			if (tasks[idx]['pass'] == undefined) tasks[idx]['pass'] = new Array()
			tasks[idx]['pass'] = whoPass[key].pass.split(',')
		}
		res.json({tasks})
	})
}

function cntProblem(req,res) {
    const userData = req.user
	let allProblem = new Promise((resolve, reject) => {
		let sql = 'select count(*) as allP from Problem where state = 1'
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	let allUserDo = new Promise((resolve, reject) => {
		let sql = 'SELECT r1.* FROM Result r1 inner join ( select prob_id,max(time) as maxTime '
			+ 'from Result where user_id = ? group by prob_id) r2 on r1.prob_id = r2.prob_id and r1.time = r2.maxTime'
		db.query(sql, [userData?.id], (err, result) => err ? reject(err) : resolve(result))
	})
	let allUserOnline = new Promise((resolve, reject) => {
		let sql = `select sname from session as s inner join User as U on s.idUser = U.idUser 
			where expires >= UNIX_TIMESTAMP() group by s.idUser`
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	Promise.all([allProblem, allUserDo, allUserOnline]).then((result) => {
		let passProb = 0;
		let wrongProb = 0;
		let sz = result[1].length;
		for (let i = 0; i < sz; i++) {
			if (result[1][i].score == 100) passProb++
			else wrongProb++
		}
		res.json({
			allProblem: result[0][0].allP,
			userProblem: { passProb, wrongProb },
			onlineUser: result[2]
		})
	})
}

function getDoc(req,res) {
	const token = req.cookies.token
	const userData = verifyToken(token)
	let getProblem = new Promise((resolve, reject) => {
		let sql = `select * from Problem where sname = ?`
		db.query(sql, [req.params.name], (err, result) => err ? reject(err) : resolve(result))
	})
	let getContest = new Promise((resolve, reject) => {
		let sql = `select idContest,name,problems from Contest where time_end >= (UNIX_TIMESTAMP()) and time_start <= (UNIX_TIMESTAMP())`
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	Promise.all([getProblem, getContest]).then((result) => {
		var probData = result[0][0]
		var holdingCon = result[1][0]
		var probInCon = holdingCon ? JSON.parse(holdingCon.problems) : []
		if(probData && probData.state === 1) return res.sendFile(`${process.cwd()}/docs/${req.params.name}.pdf`)
		else {
			if(userData?.state === 0 || probInCon.includes(probData.id_Prob)) return res.sendFile(`${process.cwd()}/docs/${req.params.name}.pdf`)
			else return res.status(401).send('Access denied')
		}
	})
}

module.exports = {
    getProblem,
    cntProblem,
    getDoc
}