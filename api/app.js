const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const logger = require('morgan');
const sha256 = require('js-sha256');
const cookieParser = require('cookie-parser')
const mysql = require('mysql')
const db = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '0000',
	database: 'OTOG'
})
db.connect()
/*
const mongodb = require("mongodb");
const client = mongodb.MongoClient;
const CONN_URL = "mongodb+srv://admin:0000@otog-w9ssf.gcp.mongodb.net/test?retryWrites=true&w=majority";
let mongoClient = null;
client.connect(CONN_URL,{ useNewUrlParser: true,useUnifiedTopology: true }, function (err, DBclient) {
	mongoClient = DBclient;
 })*/
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
	if (mode == 'firstpage') {
		let sql = 'select * from Problem where state = 1 order by see_date desc limit 10'
		db.query(sql,(err,result) => {
			if(err) res.status(400).send(err)
			res.status(200).json(result)
		})
	} else {
		let sql = 'select * from Problem where state = 1 order by id_Prob'
		db.query(sql,(err,result) => {
			if(err) res.status(400).send(err)
			res.status(200).json(result)
		})
	}
})
app.post('/api/login', async (req, res) => {
	var hash = sha256.create();
	var username = req.body.username;
	var password = req.body.password;
	hash.update(password);
	console.log(username + ' Sign in at' + Date(Date.now()));
	let sql = 'select * from User where username = "' + username + '"'
	var result = await new Promise((resolve,reject) => {
		db.query(sql,(err,result) => {
			if(err) reject(err)
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
app.get('/api/user', (req,res) => {
	let sql = "SELECT sname,rating FROM User inner join Result as R on User.idUser = R.user_id "+
		"where contestmode is not null and state = 1 group by sname order by rating desc"
	db.query(sql, function (err, result) {
		console.log(err);		
		if (err) res.status(400).send(err);
		console.log(result);
		
		res.json(result);
	});
})
app.listen(PORT, () => {
	console.log("Starting server at PORT " + PORT)
})
