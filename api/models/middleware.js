const jwt = require('jsonwebtoken')
const JWTAUTH = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if(token) {
        try {
            const userData = jwt.verify(token, process.env.PUBLIC_KEY, {
                algorithm: "RS256"
            })
            res.locals.userData = userData
        } catch {
            return res.status(401).send('')
        }
    } 
    return next()
}

function AdminAuth(req, res, next) {
	const token = req.headers.authorization?.split(' ')[1]
	try {
		let userData = jwt.verify(token, process.env.PUBLIC_KEY, {
			algorithm: "RS256"
		})
		if (userData.state === 0) next()
		else res.status(404).json({})
	} catch {
		res.status(404).json({})
	}
}

module.exports = {
    JWTAUTH,
    AdminAuth
}