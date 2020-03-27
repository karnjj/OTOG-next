const express = require('express')
const fs = require('fs')
const routes = require('./controller/route')

process.env.SECRET_KEY = fs.readFileSync('./private.key', 'utf8');
process.env.PUBLIC_KEY = fs.readFileSync('./public.key', 'utf8');

var app = express()
var PORT = process.env.PORT || 8000

app.use('/api',routes)

app.listen(PORT, () => {
	console.log("Starting server at PORT " + PORT)
})
