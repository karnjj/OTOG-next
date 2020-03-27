const db = require('../models/database').Pool

function getProblem(req,res) {
    let mode = req.query.mode
	let idUser = req.headers.authorization
	let whoPassPromise = new Promise((resolve, reject) => {
		let sql = "select prob_id,GROUP_CONCAT(DISTINCT(sname) SEPARATOR ',') as pass from Result " +
			"inner join User as U on Result.user_id = U.idUser " +
			"where score = 100 and state = 1 group by prob_id"
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	let problemPromise = new Promise((resolve, reject) => {
		let sql = '';
		if (mode == 'firstpage') sql = 'select * from Problem where state = 1 order by see_date desc limit 10'
		else sql = 'select * from Problem where state = 1 order by id_Prob desc'
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	let PassOrWrongPromise = new Promise((resolve, reject) => {
		let sql = `SELECT 
		GROUP_CONCAT( DISTINCT CASE WHEN score = 100 THEN prob_id ELSE NULL 
			END SEPARATOR ' ') AS pass,
		GROUP_CONCAT( DISTINCT CASE WHEN score != 100 THEN prob_id ELSE NULL 
			END SEPARATOR ' ') AS wrong 
		FROM Result where user_id = ?`;
		db.query(sql, [idUser], (err, result) => err ? reject(err) : resolve(result))
	})
	const promiseValue = [whoPassPromise, problemPromise]
	if (idUser) promiseValue.push(PassOrWrongPromise)
	Promise.all(promiseValue).then(result => {
		let whoPass = result[0]
		let problems = result[1]
		let answer = result[2]
		if (answer !== undefined) {
			answer = answer[0]
			answer.pass = answer.pass ? answer.pass.split(' ') : []
			answer.wrong = answer.wrong ? answer.wrong.split(' ') : []
			for (let i in answer.pass) {
				let idx = problems.findIndex(obj => obj.id_Prob == Number(answer.pass[i]))
				if (idx == -1) continue
				problems[idx]['acceptState'] = true;
			}
			for (let i in answer.wrong) {
				let idx = problems.findIndex(obj => obj.id_Prob == Number(answer.wrong[i]))
				if (idx == -1) continue
				problems[idx]['wrongState'] = true;
			}
		}
		for (let key in whoPass) {
			let idx = problems.findIndex(obj => obj.id_Prob == whoPass[key].prob_id)
			if (idx == -1) continue
			if (problems[idx]['pass'] == undefined) problems[idx]['pass'] = new Array()
			problems[idx]['pass'] = whoPass[key].pass.split(',')
		}
		res.json(problems)
	})
}

function cntProblem(req,res) {
    let idUser = req.headers.authorization
	let allProblem = new Promise((resolve, reject) => {
		let sql = 'select count(*) as allP from Problem where state = 1'
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	let allUserDo = new Promise((resolve, reject) => {
		let sql = 'SELECT r1.* FROM Result r1 inner join ( select prob_id,max(time) as maxTime '
			+ 'from Result where user_id = ? group by prob_id) r2 on r1.prob_id = r2.prob_id and r1.time = r2.maxTime'
		db.query(sql, [idUser], (err, result) => err ? reject(err) : resolve(result))
	})
	let allUserOnline = new Promise((resolve, reject) => {
		let sql = `select count(*) as online from session where expires >= UNIX_TIMESTAMP()`
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
			onlineUser: result[2][0].online
		})
	})
}

function getDoc(req,res) {
    res.sendFile(`${process.cwd()}/docs/${req.params.name}.pdf`);
}

module.exports = {
    getProblem,
    cntProblem,
    getDoc
}