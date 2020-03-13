const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const logger = require('morgan');
const sha256 = require('js-sha256');
const cookieParser = require('cookie-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')
const mkdirp = require('mkdirp');
const db = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '0000',
	database: 'OTOG'
})
db.connect()
process.env.SECRET_KEY = fs.readFileSync('./private.key', 'utf8');
process.env.PUBLIC_KEY = fs.readFileSync('./public.key', 'utf8');
var app = express()
app.use(cors())
var PORT = process.env.PORT || 8000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(logger('dev'));
/*
app.use((req,res,next)=>{
	req.db = mongoClient.db('OTOG');
	next();
 })*/
app.get('/api/problem', async (req, res) => {
	let mode = req.query.mode
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
	Promise.all([whoPassPromise, problemPromise]).then(result => {
		let whoPass = result[0];
		let problem = result[1]
		for (let key in whoPass) {
			let idx = problem.findIndex(obj => obj.id_Prob == whoPass[key].prob_id)
			if (idx == -1) continue
			if (problem[idx]['pass'] == undefined) problem[idx]['pass'] = new Array()
			problem[idx]['pass'] = whoPass[key].pass.split(',')
		}
		res.json(problem)
	})
})
app.post('/api/login', async (req, res) => {
	var hash = sha256.create();
	var username = req.body.username;
	var password = req.body.password;
	hash.update(password);
	console.log(username + ' Sign in at' + Date(Date.now()));
	let sql = 'select * from User where username = "' + username + '"'
	var result = await new Promise((resolve, reject) => {
		db.query(sql, (err, result) => {
			if (err) reject(err)
			resolve(result[0])
		})
	})
	if (!result) res.status(401).send('Username not found!!')
	else if (result.password != hash.hex()) res.status(401).send('Password incorrect!!')
	else {
		var data = { username: result.username, id: result.idUser, sname: result.sname, state: result.state }
		let token = jwt.sign(data, process.env.SECRET_KEY, {
			algorithm: "RS256"
		})
		res.status(200).json(token);
	}
})
app.get('/api/auth', (req, res) => {
	let token = req.headers.authorization
	try {
		let js = jwt.verify(token, process.env.PUBLIC_KEY, {
			algorithm: "RS256"
		})
		res.status(200).json(js)

	} catch {
		res.status(401).json({})
	}
})
app.get('/api/user', (req, res) => {
	let sql = "SELECT sname,rating FROM User inner join Result as R on User.idUser = R.user_id " +
		"where contestmode is not null and state = 1 group by sname order by rating desc"
	db.query(sql, function (err, result) {
		if (err) res.status(400).send(err);
		res.json(result);
	});
})

app.get('/api/countProblem', (req, res) => {
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
	Promise.all([allProblem, allUserDo]).then((result) => {
		let passProb = 0;
		let wrongProb = 0;
		let sz = result[1].length;
		for (let i = 0; i < sz; i++) {
			if (result[1][i].score == 100) passProb++
			else wrongProb++
		}
		res.json({
			allProblem: result[0][0].allP,
			userProblem: { passProb, wrongProb }
		})
	})
})
app.get('/api/docs/:name', (req, res) => {
	res.sendFile(__dirname + '/docs/' + req.params.name + '.pdf');
})
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var idUser = req.headers.authorization
		mkdirp(`uploaded/${idUser}`).then(made => {
			cb(null, `uploaded/${idUser}`)
		})
	},
	filename: function (req, file, cb) {
		var idProb = req.params.id
		var time = req.body.time
		var fileExt = path.extname(file.originalname)
		cb(null, `${idProb}_${time}${fileExt}`)
	}
})
var upload = multer({ storage: storage })
app.post('/api/upload/:id', upload.single('file'), (req, res) => {
	var time = req.body.time
	var idProb = req.params.id
	var idUser = req.headers.authorization
	var sql = "INSERT INTO Result (time, user_id, prob_id, status,contestmode) VALUES ?";
	var values = [[time, idUser, idProb, 0, null],];
	con.query(sql, [values], (err, result) => err || console.log(err))
	res.status(200).json({ msg: 'Upload Complete!' })
})
app.listen(PORT, () => {
	console.log("Starting server at PORT " + PORT)
})
