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
    editProblem,
    editUser
}