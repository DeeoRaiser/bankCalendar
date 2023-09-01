const express = require("express")
const router = express.Router()
const jwtVerify = require("../middlewares/jwsVerify")
const isAdmin = require("../middlewares/isAdmin")

const enterpriseController = require ('../controllers/enterprise.controller')


router.get('/api/enterprises', jwtVerify, enterpriseController.getAllEnterprises)
router.post('/api/new-enterprise', jwtVerify,isAdmin,  enterpriseController.newEnterprise)
router.post('/api/update-enterprise', jwtVerify,isAdmin,  enterpriseController.editEnterprise)
router.delete('/api/delete-enterprise/:id', jwtVerify, isAdmin, enterpriseController.deleteEnterprise)

module.exports = router