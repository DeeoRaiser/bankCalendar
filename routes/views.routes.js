const express = require('express')
const router = express.Router()

router.get('/login',(req, res)=>{res.render('login')})
router.get('/',(req, res)=>{res.render('checks')})
router.get('/enterprises/abm',(req, res)=>{res.render('enterprises')})
router.get('/banks/abm',(req, res)=>{res.render('banks')})
router.get('/users/abm',(req, res)=>{res.render('users')})


module.exports = router