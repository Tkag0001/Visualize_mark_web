const express = require('express')
const accounts = require('../Controllers/accountController')
const router = express.Router()

router.route('/login')
    .post(accounts.loginAccount)
router.route('/register')
    .post(accounts.registerAccount)
router.route('/check')
    .post(accounts.checkUser)
    
module.exports = router 