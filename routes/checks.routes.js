const express = require('express')
const router = express.Router()
const jwtVerify = require('../middlewares/jwsVerify')
const isAdmin = require("../middlewares/isAdmin")

const checkController = require('./../controllers/check.controller')


router.post('/api/check/new', jwtVerify, isAdmin, checkController.newCheck)
router.delete('/api/check/delete/:id', jwtVerify, isAdmin, checkController.delCheck)
router.get('/api/checks/:startDate/:endDate/:enterprise', jwtVerify, checkController.getChequesByDateRangeAndEnterprise)

module.exports = router