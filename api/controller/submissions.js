const db = require('../models/database').Pool
const jwt = require('jsonwebtoken')


async function AllSubmission(req, res) {
	let mode = req.query.mode
	let last = req.query.last ? Number(req.query.last) : undefined
	const userData = req.user
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
			sql = `SELECT idResult,U.sname,U.rating,U.state,U.idUser as idUser,P.name,P.sname as problemname,result,timeuse,Result.score,Result.time as time,errmsg FROM Result 
			inner join Problem as P on Result.prob_id = P.id_Prob
			inner join User as U on Result.user_id = U.idUser
			where contestmode is null 
			${(userData?.state === 0) ? '' : 'and P.state = 1 '}
			${(last === undefined) ? '' : `and idResult between ${last-54} and ${last-1} `}
			order by idResult desc limit 53`
		else
			sql = `SELECT idResult,U.sname,U.rating,U.state,U.idUser as idUser,P.name,P.sname as problemname,result,timeuse,Result.score,Result.time as time,errmsg FROM Result 
			inner join Problem as P on Result.prob_id = P.id_Prob
			inner join User as U on Result.user_id = U.idUser
			where contestmode is null and user_id = ? 
			${(last === undefined) ? '' : `and idResult between ${last-54} and ${last-1} `}
			order by idResult desc limit 53`
		db.query(sql, [userData?.id], (err, result) =>
			err ? reject(err) : resolve(result)
		)
	})
	let oldestPromise = new Promise((resolve, reject) => {
		var sql = ''
		if (mode == 'full')
			sql = `SELECT idResult from Result 
			inner join Problem as P on Result.prob_id = P.id_Prob 
			where contestmode is null 
			${(userData?.state === 0) ? '' : 'and P.state = 1 '}
			order by idResult asc limit 1`
		else
			sql = `SELECT idResult FROM Result 
			where contestmode is null and user_id = ? 
			order by idResult asc limit 1`
		db.query(sql, [userData?.id], (err, result) =>
			err ? reject(err) : resolve(result)
		)
	})
	Promise.all([lastestPromise, submitPromise, oldestPromise]).then((values) => {
		res.json({ results: values[1], latest: values[0], hasMore: values[2][0].idResult == values[1][values[1].length-1].idResult })
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
	res.json({ results: submit })
}

module.exports = {
	AllSubmission,
	ContestSubmission,
}
