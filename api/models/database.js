const mysql = require('mysql')
const config =require('../config')


const Pool = mysql.createPool(config.dbConfig)


module.exports = {
    Pool
}