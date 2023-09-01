const User = require('../schemas/user.schema')

async function isAdmin(req, res, next) {

    if(await admin(req.headers.userId)){
        console.log("\x1b[33m Admin User \x1b[0m ")
        next()
    }else{
        console.log("\x1b[31m \x1b[33m NO Admin User \x1b[0m ")
        return res.status(404).send({ msg: `Unauthorized access` })
    }
}

async function admin(id) {
    const user = await User.findById(id)
    if (user.role === 'ADMIN_ROLE' || user.role === 'USER_CREATOR') {
        return true
    } else {
        return false
    }

}

module.exports = isAdmin