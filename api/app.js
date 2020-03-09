const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const logger = require('morgan');
const mongodb = require("mongodb");
const sha256 = require('js-sha256');
const cookieParser = require('cookie-parser')
const client = mongodb.MongoClient;
const CONN_URL = "mongodb://localhost:2277/";
let mongoClient = null;
client.connect(CONN_URL,{ useNewUrlParser: true,useUnifiedTopology: true }, function (err, DBclient) {
	mongoClient = DBclient;
 })
process.env.SECRET_KEY = fs.readFileSync('./private.key', 'utf8');
process.env.PUBLIC_KEY = fs.readFileSync('./public.key', 'utf8');
var app = express()
app.use(cors())
var PORT = process.env.PORT || 8000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(cookieParser())
app.use(logger('dev'));
app.use((req,res,next)=>{
	req.db = mongoClient.db('OTOG');
	next();
 })
app.get('/api/problem',async (req,res) => {
	let result = await req.db.collection('problems').find()
	let mode = req.query.mode
    if(mode == 'firstpage') {
		result.sort({ see_date: -1 }).limit(10).toArray((err,result) => {
            res.status(200).json(result);
        })
    }else {
        result.sort({ id_Prob: -1 }).toArray((err,result) => {
            res.status(200).json(result);
        })
    }
})
app.post('/api/login',async (req,res) => {
	var hash = sha256.create();
	var username = req.body.username;
	var password = req.body.password;
	hash.update(password);
	console.log(username + ' Sign in at' + Date(Date.now()));
	var query = {
        "username": username
    };
	var result = await req.db.collection('user').findOne(query);
	if(!result) res.status(401).send('Username not found!!')
	else if(result.password != hash.hex()) res.status(401).send('Password incorrect!!')
	else {
		var data = {username : result.username, id : result.idUser, sname : result.sname, state:result.state}
		let token = jwt.sign(data, process.env.SECRET_KEY, {
			algorithm:  "RS256"
		})
		res.status(200).json(token);
	}
})
app.get('/api/auth',(req,res) => {
	let token = req.headers.authorization
	try {
		let js = jwt.verify(token,process.env.PUBLIC_KEY,{
			algorithm:  "RS256"
		})
		res.status(200).json(js)

	}catch {
		res.status(401).json({})
	}
})
app.listen(PORT,() => {
	console.log("Starting server at PORT " + PORT)
})
