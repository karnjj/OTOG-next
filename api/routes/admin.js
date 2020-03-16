var express = require('express');
var router = express.Router();
router.get('/problem',(req,res) => {
    var sql = 'select * from Problem'
    
    res.json()
})
module.exports = router;