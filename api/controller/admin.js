const db = require('../models/database').Pool
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs')
var unzipper = require('unzipper');
const { resolve } = require('path');
const contest = require('./contest');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.fieldname == 'pdf') cb(null, `docs`)
		else if (file.fieldname == 'zip') cb(null, `grader/source`)
	},
	filename: function (req, file, cb) {
		var sname = req.body.sname
		if (file.fieldname == 'pdf') cb(null, `${sname}.pdf`)
		else if (file.fieldname == 'zip') cb(null, `${sname}.zip`)
	}
})
const multerConfig = multer({ storage: storage })

async function Problems(req, res) {
	var sql = 'select * from Problem'
	let problem = await new Promise((resolve) => {
		db.query(sql, (err, result) => resolve(result))
	})
	for(var i in problem) {
		var pathName = `./grader/source/${problem[i].sname}`
		var casePathName = `./grader/source/${problem[i].sname}/1.in`
		if (fs.existsSync(pathName) && fs.existsSync(casePathName) ) {
			problem[i].noTestcase = false;
		}else problem[i].noTestcase = true;
	}
	res.json(problem)
}
async function Users(req, res) {
	var sql = 'select * from User'
	let problem = await new Promise((resolve) => {
		db.query(sql, (err, result) => resolve(result))
	})
	res.json(problem)
}
async function addUsers(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var sname = req.body.sname;
	let sql = 'select * from User where username = ?'
	db.query(sql, [username], (err, result) => {
		if (result[0] === undefined) {
			var hash = sha256.create()
			hash.update(password)
			password = hash.hex()
			var sql = "insert into User (username, password, sname) values ?"
			var values = [
				[username, password, sname],
			]
			db.query(sql, [values], (err) => err ? console.log(err) :
				res.status(200).send(''))
		} else res.status(403).send('')
	})
}
async function deleteUsers(req, res) {
	const idUser = req.params.id
	let sql = 'delete from User where idUser = ?'
	db.query(sql, [idUser], (err) => {
		if (err) res.status(403).send('')
		else res.status(200).send('')
	})

}
async function Contests(req, res) {
	var sql = 'select idContest, name from Contest order by idContest desc'
	let contests = await new Promise((resolve) => {
		db.query(sql, (err, result) => resolve(result))
	})
	res.json({contests})
}

async function getContestWithId(req, res) {
	const idContest = req.params.id
	var sql = 'select idContest,name,mode_grader as mode,judge,time_start as startDate,time_end as endDate,problems from Contest where idContest = ?'
	let contests = await new Promise((resolve) => {
		db.query(sql, [idContest], (err, result) => resolve(result))
	})
	if(contests[0]) {
		contests[0].problems = JSON.parse(contests[0].problems)
	}
	res.json(contests[0] ?? {})
}

// function getContestWithId(req, res) {
// 	const idContest = req.params.id
// 	const mode = req.query.mode
// 	var contestPromise = new Promise((resolve) => {
// 		var sql = `select * from Contest where idContest = ?`
// 		db.query(sql, [idContest], (err, result) => resolve(result))
// 	})
// 	switch (mode) {
// 		case 'config':
// 			contestPromise.then((contest) => {
// 				if(contest[0]) {
// 					const config = {
// 						name : contest[0].name,
// 						mode : contest[0].mode_grader,
// 						judge : contest[0].judge,
// 						startDate : contest[0].time_start*1000,
// 						endDate : contest[0].time_end*1000
// 					}
// 					return res.json(config)
// 				}else return res.status(404).send('')
// 			})
// 			break
// 		case 'problem':
// 			let problemPromise = new Promise((resolve) => {
// 				var sql = 'select * from Problem'
// 				db.query(sql, (err, result) => resolve(result))
// 			})
// 			Promise.all([problemPromise, contestPromise]).then(values => {
// 				var problem = values[0]
// 				var conProb = values[1]
// 				if (conProb[0]) {
// 					conProb = JSON.parse(conProb[0].problems)
// 					conProb.map(idProb => {
// 						var idx = problem.findIndex(obj => obj.id_Prob === idProb)
// 						if (idx != -1) problem[idx].see = true
// 					})
// 				}
// 				res.json(problem)
// 			})
// 			break
// 		case 'detail':
// 			break
// 	}
// }
function patchContestConfig(req, res) {
	const idContest = req.params.id
	const data = req.body
	if (idContest == 0) {
		res.status(404).send('')
		return
	}
	let sql = `update contest set name = ?, mode_grader = ?, judge = ?, 
		time_start = ?, time_end = ? where idContest = ?`
	let value = [
        data.name,
        data.mode,
        data.judge,
        data.stateDate,
        data.endDate,
        idContest
    ]
	db.query(sql,value,(err) => {
        if(err) return res.status(404).send('')
        return res.json({msg:`Update complete.`})
    })
}

function contestAnnounce(req, res) {
    const idContest = req.params.id
	const data = req.body
	if (idContest == 0) {
		res.status(404).send('')
		return
	}
	let sql = `update contest set announce = ? where idContest = ?`
	db.query(sql,[data.announce, idContest],(err) => {
        if(err) return res.status(404).send('')
        return res.json({msg:`Update complete.`})
    })
}
function contestProblem(req, res) {
    const idContest = req.params.id
    const idProblem = Number(req.params.probId)
	let sql = `select problems from Contest where idContest = ?`
	db.query(sql, [idContest], (err, result) => {
		var conProb = JSON.parse(result[0].problems)
		if (idProblem in conProb) conProb = conProb.filter(item => item !== idProblem)
		else conProb.push(idProblem)
		let sql = `update Contest set problems = ? where idContest = ?`
		db.query(sql, [JSON.stringify(conProb), idContest], (err) => {
			if (err) throw err
			res.status(200).send({msg:'Update complete.'})
		})
	})
}

async function editUser(req, res) {
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
function editProblem(req, res) {
	const data = req.body
	const idProb = req.params.id
	const option = req.query.option
	switch (option) {
		case 'save':
			const dir = `./grader/source/${data.sname}`
			if (req.files.zip !== undefined) {
				if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true });
				fs.mkdirSync(dir);
				fs.createReadStream(req.files.zip[0].path)
					.pipe(unzipper.Extract({ path: dir }));
				fs.unlink(req.files.zip[0].path, function (err) {
					if (err) throw err;
				});
			}
			if (!fs.existsSync(dir)) fs.mkdirSync(dir);
			if (data.subtask != 'null') fs.writeFile(dir + '/script.php', 'cases = ' + data.subtask + ';', function (err) {
				if (err) throw err;
			});
			data.rating = (data.rating == 'null' || data.rating == '') ? null : Number(data.rating)
			var sql = `update Problem set name = ?, sname = ?, 
				score = ?, time = ?, memory = ?${data.subtask != 'null' ? `, subtask = ?`: ``} 
				, rating = ? where id_Prob = ${idProb}`
			var val = [data.name, data.sname, data.score, data.time, data.memory]
			if (data.subtask != 'null') val.push(data.subtask)
			val.push(data.rating)
			db.query(sql, val, (err) => {
				if (err) throw err
				res.status(200).send('')
			})
			break;
		case 'onoff':
			var sql = `update Problem set state = ?, see_date = ? where id_Prob = ${idProb}`
			var millis = Date.now();
			var time_now = Math.floor(millis / 1000);
			db.query(sql, [(!data.onoff), time_now], (err) => {
				if (err) throw err
				res.status(200).send('')
			})
			break;
	}
}
function addProblem(req, res) {
	const data = req.body
	const dir = `./grader/source/${req.body.sname}`
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
	if (req.files.zip !== undefined) {
		fs.createReadStream(req.files.zip[0].path)
			.pipe(unzipper.Extract({ path: dir }));
		fs.unlink(req.files.zip[0].path, function (err) {
			if (err) throw err;
		});
	}
	if (data.numCase != 'undefined') fs.writeFile(dir + '/script.php', 'cases = ' + data.numCase + ';', function (err) {
		if (err) throw err;
	});
	var sql = `insert into Problem (name, sname, score, time, memory${(data.numCase != 'undefined') ? `,subtask` : ``}) values ?`
	var values = [
		[data.name, data.sname, data.score, data.time, data.memory],
	]
	if (data.numCase != 'undefined') values[0].push(data.numCase)
	db.query(sql, [values], (err) => {
		if (err) {
			console.log(err);
			res.status(404).send('')
		}else res.status(200).send('')
	})
}
function deleteProblem(req, res) {
	const idProblem = req.params.id
	const sname = req.query.sname
	let sql = 'delete from Problem where id_Prob = ?'
	db.query(sql, [idProblem], (err) => {
		if (err) res.status(403).send('')
	})
	const dirTestcase = `./grader/source/${sname}`
	const dirPDF = `./docs/${sname}.pdf`
	if (fs.existsSync(dirTestcase)) fs.rmdirSync(dirTestcase, { recursive: true })
	if (fs.existsSync(dirPDF)) fs.unlinkSync(dirPDF);
	res.status(200).send('')
}

function addContest(req, res) {
	const data = req.body
	var sql = "INSERT INTO Contest (name,mode_grader,judge,time_start,time_end) VALUES ?"
	var values = [
		[data.name, data.mode, data.judge, data.start, data.end],
	]
	db.query(sql, [values], function (err, rows) {
		if (err) res.status(404).send('')
		else res.status(200).json({msg:"success"})
	});
}
module.exports = {
	Problems,
	Users,
	addUsers,
	deleteUsers,
	Contests,
	editProblem,
	editUser,
	getContestWithId,
    patchContestConfig,
    contestAnnounce,
    contestProblem,
	addProblem,
	multerConfig,
	deleteProblem,
	addContest
}