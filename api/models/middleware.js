const jwt = require('jsonwebtoken')
const JWTAUTH = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1]
    var userData = false
    if(token) {
        try {
            userData = jwt.verify(token, process.env.PUBLIC_KEY, {
                algorithm: "RS256"
            })
        } catch {
            return res.status(401).send('')
        }
    } 
    res.locals.userData = userData
    return next()
}

module.exports = {
    JWTAUTH
}