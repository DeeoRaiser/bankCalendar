const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

async function jwtVerify(req, res, next) {
    try {
        const token = req.headers.authorization
        const payload = jwt.verify(token, secret)

        req.headers = payload

        if(payload){
            console.log(payload)
            console.log(`\x1b[35m Valid token \x1b[0m Id: ${payload.userId} \x1b[32m User: ${payload.userName}\x1b[0m`)
            next()
        }else{
            console.log("\x1b[31m Invalid token \x1b[0m ")
        }
    } catch (error) {
        console.log(error)
        console.log("\x1b[31m Invalid token \x1b[0m ")
    }
}

module.exports = jwtVerify