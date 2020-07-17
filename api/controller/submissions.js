const db = require('../models/database').Pool
const jwt = require('jsonwebtoken')


async function AllSubmission(req, res) {
	let mode = req.query.mode
	const userData = res.locals.userData
	let lastestPromise = new Promise((resolve, reject) => {
		var sql = `select name,id_Prob,sname from ( select max(idResult) as lastest from Result where user_id = ?) 
			as X inner join Result on Result.idResult = X.lastest inner join Problem on prob_id = Problem.id_Prob`
		db.query(sql, [userData?.id], (err, result) =>
			err ? reject(err) : resolve(result[0])
		)
	})
	let submitPromise = new Promise((resolve, reject) => {
		var sql = ''
		if (mode == 'full')
			sql = `SELECT idResult,U.sname,U.rating,U.state,U.idUser as idUser,P.name,P.sname as problemname,result,timeuse,Result.score,errmsg FROM Result 
			inner join Problem as P on Result.prob_id = P.id_Prob
			inner join User as U on Result.user_id = U.idUser
			where contestmode is null${(userData?.state === 0) ? ' ' : ' and P.state = 1 '}order by idResult desc limit 100`
		else
			sql = `SELECT idResult,U.sname,U.rating,U.state,U.idUser as idUser,P.name,P.sname as problemname,result,timeuse,Result.score,errmsg FROM Result 
			inner join Problem as P on Result.prob_id = P.id_Prob
			inner join User as U on Result.user_id = U.idUser
			where contestmode is null and user_id = ? order by idResult desc limit 100`
		db.query(sql, [userData?.id], (err, result) =>
			err ? reject(err) : resolve(result)
		)
	})
	Promise.all([lastestPromise, submitPromise]).then((values) => {
		res.json({ result: values[1], lastest: values[0] })
	})
}

async function ContestSubmission(req, res) {
	let submit = await new Promise((resolve, reject) => {
		var sql = `SELECT idResult,U.sname,U.rating,U.state, U.idUser, P.name,result,timeuse,Result.score,errmsg FROM Result 
			inner join Problem as P on Result.prob_id = P.id_Prob
			inner join User as U on Result.user_id = U.idUser
			where contestmode is not null order by idResult desc limit 100`
		db.query(sql, (err, result) => (err ? reject(err) : resolve(result)))
	})
	res.json({ result: submit })
}

module.exports = {
	AllSubmission,
	ContestSubmission,
}
