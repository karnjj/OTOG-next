const db = require('../models/database').Pool
const jwt = require('jsonwebtoken')

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

function contest(req,res) {
	let sql = `select idContest,time_start,time_end from Contest where time_end >= UNIX_TIMESTAMP() order by time_start limit 1`
	db.query(sql,(err,result) => {
		res.json(result)
	})
}

function getAllContest(req,res) {
	let sql = `select * from Contest where time_end < UNIX_TIMESTAMP()`
	db.query(sql, (err, result) => {
		if (err) throw err
		res.json(result)
	});
}

function getContestWithId(req,res) {
	const idContest = req.params.id
	const token = req.headers.authorization
	var userData = verifyToken(token)
	let sql = `select * from Contest where idContest = ?`
	db.query(sql, [idContest], (err, result) => {
		if (err) throw err
		const problem = JSON.parse(result[0].problems)
		problem.sort((a, b) => a - b);
		let sql = `SELECT id_Prob,name,group_concat(distinct CASE WHEN R.score = 100 THEN user_id ELSE null END SEPARATOR ' ') 
			as sum FROM Problem left join Result as R on R.prob_id = id_Prob
			WHERE id_Prob IN (?) group by id_Prob`
		db.query(sql, [problem], (err, prob) => {
			if (err) throw err
			const start = result[0].time_start
			const now = Math.floor(new Date() / 1000)
			for(var i in prob) {
				prob[i].sum = prob[i].sum ? prob[i].sum.split(" ").length : 0
			}
			if(start <= now || userData.state === 0) {
				res.json({
					name: result[0].name,
					id: result[0].idContest,
					timeEnd: result[0].time_end,
					problem: prob
				})
			}else res.status(404).json({})
		})
	});
}

function getContestHistoryWithId(req,res) {
    const idContest = req.params.idContest
	let sql = `select U.idUser,sname,R1.prob_id,score,timeuse from 
		(select user_id,prob_id,max(idResult) as lastest from Result where contestmode = ? group by user_id,prob_id) as R1 
		inner join Result as R2 on R1.user_id = R2.user_id and R1.prob_id = R2.prob_id and R1.lastest = R2.idResult 
		inner join User as U on U.idUser = R1.user_id where U.state = 1 order by U.idUser,R1.prob_id`
	db.query(sql, [idContest], (err, result) => {
		var new_result = []
		var info = {}
		result.map((data,index) => {
			if(info.sum === undefined) info.sum = 0
			if(info.sumTime === undefined) info.sumTime = 0
			if(info.scores === undefined) info.scores = {}
			if(info.scores[data.prob_id] === undefined) info.scores[data.prob_id] = {}
			info.idUser = data.idUser
			info.sname = data.sname
			info.sum +=  Number(Math.floor(data.score))
			info.sumTime +=  Number(data.timeuse)
			info.scores[data.prob_id].score =  Number(Math.floor(data.score))
			var next = result[Number(index)+1] || {idUser:-1}
			if(data.idUser != next.idUser) {
				new_result.push(info)
				info = {}
			}
		})
		new_result.sort((a,b) => b.sum - a.sum)
		var Rank = 1
		for(var idx in new_result) {
			 if (idx != 0) if(new_result[idx].sum != new_result[idx-1].sum) Rank = Number(idx)+1
			new_result[idx].rank = Rank 
		}
		res.json(new_result)
	});
}

function getContestSubmissionWithId(req,res) {
    const idContest = req.params.id
	const idProb = req.query.idProb
	const idUser = req.headers.authorization
	var last_query = `select idResult,result,errmsg,status,score from Result 
		where user_id = ? and prob_id = ? and contestmode = ? 
		order by idResult desc limit 1`
	var best_query = `select idResult,result,score,errmsg from Result 
		where user_id = ? and prob_id = ? and contestmode = ?
		order by score desc, timeuse asc limit 1`
	var lastest = new Promise((resolve, reject) => db.query(last_query, [idUser, idProb, idContest], (err, result) => {
		if (err) throw err
		resolve(result)
	}))
	var best = new Promise((resolve, reject) => db.query(best_query, [idUser, idProb, idContest], (err, result) => {
		if (err) throw err
		resolve(result)
	}))
	Promise.all([lastest, best]).then((values) => {
		res.json({
			lastest_submit: values[0],
			best_submit: values[1]
		})
	})
}

module.exports = {
	contest,
    getAllContest,
    getContestWithId,
    getContestHistoryWithId,
    getContestSubmissionWithId
}