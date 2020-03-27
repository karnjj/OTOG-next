const db = require('../models/database').Pool

async function AllSubmission(req,res) {
    let Submit = await new Promise((resolve, reject) => {
		var sql =
			`SELECT idResult,U.sname,P.name,result,timeuse,Result.score,errmsg FROM Result 
			inner join Problem as P on Result.prob_id = P.id_Prob
			inner join User as U on Result.user_id = U.idUser
			order by idResult desc limit 100`
		db.query(sql, (err, result) => err ? reject(err) : resolve(result))
	})
	res.json(Submit)
}
module.exports = {
    AllSubmission
}