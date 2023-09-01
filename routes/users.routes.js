const express = require('express')
const router = express.Router()

const jwtVerify = require("../middlewares/jwsVerify")
const isAdmin = require("../middlewares/isAdmin")

const userController = require('../controllers/user.controller')


router.post('/api/login', userController.login)
router.post('/api/new-user', jwtVerify, isAdmin, userController.newUser)
router.get('/api/get-users', jwtVerify, userController.getUsers)
router.delete('/api/delete-user/:id', jwtVerify, isAdmin, userController.deleteUser)
router.post('/api/update-user', jwtVerify, isAdmin, userController.updateUser)

module.exports = router