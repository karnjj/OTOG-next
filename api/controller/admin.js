const db = require('../models/database').Pool
const sha256 = require('js-sha256');

async function Problems(req,res) {
    var sql = 'select * from Problem'
	let problem = await new Promise((resolve) => {
		db.query(sql, (err, result) => resolve(result))
	})
	res.json(problem)
}
async function Users(req,res) {
    var sql = 'select * from User'
	let problem = await new Promise((resolve) => {
		db.query(sql, (err, result) => resolve(result))
	})
	res.json(problem)
}

async function Contests(req,res) {
    var sql = 'select idContest,name from Contest'
	let contest = await new Promise((resolve) => {
		db.query(sql, (err, result) => resolve(result))
	})
	res.json(contest)
}

function getContestWithId(req,res) {
	const idContest = req.params.id
	let problemPromise = new Promise((resolve) => {
		var sql = 'select * from Problem'
		db.query(sql, [idContest], (err, result) => resolve(result))
	})
	let contestPromise = new Promise((resolve) => {
		var sql = `select problems from Contest where idContest = ?`
		db.query(sql,[idContest], (err,result) => resolve(result))
	})
	Promise.all([problemPromise,contestPromise]).then(values => {
		var problem = values[0]
		var conProb = values[1]
		if(conProb[0]) {
			conProb = JSON.parse(conProb[0].problems)
			conProb.map(idProb => {
				var idx = problem.findIndex(obj => obj.id_Prob === idProb)
				if(idx != -1) problem[idx].see = true
			})
		}
		res.json(problem)

	})
}

async function editUser(req,res) {
    const data = req.body
	const idUser = req.params.id
	var value = [data.username, data.sname, data.state]
	if (data.password) {
		var hash = sha256.create();
		hash.update(data.password);
		value.push(hash.hex())
	}
	var sql = `update User set username = ?, sname = ?, state = ?
		${data.password && `, password = ?`} where idUser = ${idUser}`
	db.query(sql, value, (err) => {
		if (err) throw err
		res.status(200).send('')
	})
}
function editProblem(req,res) {
    const data = req.body
	const idProb = req.params.id
	const option = req.query.option
	switch (option) {
		case 'save':
			var sql = `update Problem set name = ?, sname = ?, 
				score = ?, time = ?, memory = ? where id_Prob = ${idProb}`
			db.query(sql, [data.name, data.sname, data.score, data.time, data.memory], (err) => {
				if (err) throw err
				res.status(200).send('')
			})
			break;
		case 'onoff':
			var sql = `update Problem set state = ? where id_Prob = ${idProb}`
			db.query(sql, [(!data.onoff)], (err) => {
				if (err) throw err
				res.status(200).send('')
			})
			break;
	}
}

module.exports = {
    Problems,
	Users,
	Contests,
    editProblem,
	editUser,
	getContestWithId
}