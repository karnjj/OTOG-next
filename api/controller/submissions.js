const db = require('../models/database').Pool

async function AllSubmission(req,res) {
	const idUser = req.headers.authorization
	let lastestPromise = new Promise((resolve,reject) => {
			var sql = `select name,id_Prob,sname from ( select max(idResult) as lastest from Result where user_id = ?) 
			as X inner join Result on Result.idResult = X.lastest inner join Problem on prob_id = Problem.id_Prob`
			db.query(sql,[idUser],(err,result) => err ? reject(err) :resolve(result[0]))
	} )
    let submitPromise = new Promise((resolve, reject) => {
		var sql =
			`SELECT idResult,U.sname,P.name,result,timeuse,Result.score,errmsg FROM Result 
			inner join Problem as P on Result.prob_id = P.id_Prob
			inner join User as U on Result.user_id = U.idUser
			where contestmode is null order by idResult desc limit 100`
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	Promise.all([lastestPromise,submitPromise]).then(values => {
		res.json({result : values[1],lastest : values[0]})
	})
}

async function ContestSubmission(req,res) {
    let submit = await new Promise((resolve, reject) => {
		var sql =
			`SELECT idResult,U.sname,P.name,result,timeuse,Result.score,errmsg FROM Result 
			inner join Problem as P on Result.prob_id = P.id_Prob
			inner join User as U on Result.user_id = U.idUser
			where contestmode is not null order by idResult desc limit 100`
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	res.json({result : submit})
}

module.exports = {
	AllSubmission,
	ContestSubmission
}