const { Router } = require('express');
const userController = require('../contollers/authController');
const router = Router();

router.post('/signup', userController.signup);

module.exports = router;
