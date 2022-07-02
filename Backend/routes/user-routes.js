const express = require('express');
const checkAuth = require('../auth/check-auth');

const userControllers = require('../controllers/users');
//const router = require('./posts-routes.js');
const router = express.Router()

router.get('/', userControllers.getUserById)
router.post('/signup', userControllers.signup)

//router.use(checkAuth)
router.post('/login', userControllers.login)




module.exports = router;