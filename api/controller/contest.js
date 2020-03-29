const db = require('../models/database').Pool

function getAllContest(req,res) {
    let sql = `select * from Contest`
	db.query(sql, (err, result) => {
		if (err) throw err
		res.json(result)
	});
}

function getContestWithId(req,res) {
    const idContest = req.params.id
	let sql = `select * from Contest where idContest = ?`
	db.query(sql, [idContest], (err, result) => {
		if (err) throw err
		const problem = JSON.parse(result[0].problems)
		problem.sort((a, b) => a - b);
		let sql = `SELECT * FROM Problem WHERE id_Prob IN (?)`
		db.query(sql, [problem], (err, prob) => {
			res.json({
				name: result[0].name,
				id: result[0].idContest,
				timeEnd: result[0].time_end,
				problem: prob
			})
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
    getAllContest,
    getContestWithId,
    getContestHistoryWithId,
    getContestSubmissionWithId
}