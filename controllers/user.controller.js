const User = require('../schemas/user.schema')

const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

checkAndCreateAdmin()

async function newUser(req, res) {
    try {
        const { userName, pass, role } = req.body

        const existingUser = await User.findOne({ userName })

        if (existingUser) {
            console.log('The entered user already exists.')
            return res.status(401).send({ msg: 'The entered user already exists.' })
        }

        const passHash = bcrypt.hashSync(pass, saltRounds)
        const newUser = new User({
            userName: userName.toLowerCase(),
            pass: passHash,
            role: role
        })

        const savedUser = await newUser.save()

        return res.status(200).send({ msg: 'New user created', user: savedUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send('Error creating user')
    }
}

async function updateUser(req, res) {
    console.log(req.body)
    try {
        const { _id, role } = req.body

        const user = {
            role
        }

        const updatedUser = await User.findByIdAndUpdate(_id, user, { new: true })

        if (!updatedUser) responseCreator(res, 404, 'No user found.')

        return res.status(200).send({ msg: 'Update user successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send('Error updating user')
    }
}

const login = async (req, res) => {
    console.log(req.body)
    try {

        const userLogin = req.body.userLogin
        const passwordLogin = req.body.passwordLogin
        if (!userLogin || !passwordLogin) {
            console.log('Login:Datos Faltantes')
            return res.status(404).send({ msg: `Incomplete login data` })
        }

        const user = await User.findOne({ userName: userLogin.toLowerCase() })

        if (!user) {
            return res.status(404).send({ msg: `User or password are incorrect.` })
        }

        const validatePass = await bcrypt.compare(passwordLogin, user.pass)

        if (!validatePass) {
            return res.status(404).send({ msg: `User or password are incorrect.` })
        }

        const body = {
            userId: user._id,
            userName: user.userName,
            role: user.role
        }
        const token = jwt.sign(body, secret)

        console.log(user)
        return res.status(200).send({
            msg: `Login successful`,
            user,
            token
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send(`Login could not be performed.`)
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.find()
        if (!users) { return res.status(404).send({ msg: `No users were found.` }) }

        return res.status(200).send({ msg: 'Users obtained successfully.', users })

    } catch (error) {
        console.log(error)
        return res.status(500).send('Error when retrieving users.')
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id
        const delUser = await User.findByIdAndDelete(id)
        if (delUser) {
            return res.status(200).send({ status: 200, msg: 'User deleted successfully.' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error')
    }
}

module.exports = {
    login,
    newUser,
    getUsers,
    deleteUser,
    updateUser
}


async function checkAndCreateAdmin() {
    try {
        const adminUser = await User.findOne({ role: 'ADMIN_ROLE' })
        const pass = bcrypt.hashSync('administrator', saltRounds)
        if (!adminUser) {
            const adminUserData = {
                userName: 'root',
                pass,
                role: 'ADMIN_ROLE'
            }

            const admin = new User(adminUserData);
            await admin.save();
            console.log('Admin user created successfully.')
        } else {
            console.log('Admin user already exists.')
        }
    } catch (error) {
        console.error('Error creating admin user:', error)
    }
}
