const express = require('express')
const router = express.Router()
const jwtVerify = require('../middlewares/jwsVerify')
const isAdmin = require("../middlewares/isAdmin")

const bankController = require('./../controllers/bank.controller')

router.get('/api/getBanks',jwtVerify , bankController.getAllBanks)
router.post('/api/new-bank', jwtVerify, isAdmin, bankController.newBank)
router.post('/api/update-bank', jwtVerify, isAdmin, bankController.editBank)
router.delete('/api/delete-bank/:id', jwtVerify, isAdmin, bankController.deleteBank)

module.exports = router