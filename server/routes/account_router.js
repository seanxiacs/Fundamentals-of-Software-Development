const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/account_controller.js')

// Create Account Page
router.post('/account', AccountController.createAccount)

// Login Page
router.post('/account/login', AccountController.loginUser)

// Get User Data
router.get('/account/token', AccountController.getUserData)

// Get Accounts Emails
router.get('/account/email', AccountController.getAllAccountsEmail)

// const AuthController = require('../controllers/auth-controller')

// router.post('/register', AuthController.registerUser)
// router.post('/login', AuthController.loginUser)
// router.get('/logout', AuthController.logoutUser)
// router.get('/loggedIn', AuthController.getLoggedIn)

module.exports = router;