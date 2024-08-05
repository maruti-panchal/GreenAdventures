const { Router } = require('express');
const userController = require('../contollers/authController');
const authController = require('../contollers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authMiddleware.isLogged,authController.updatePassword);

module.exports = router;
