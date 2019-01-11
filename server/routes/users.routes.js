'use strict';
var express = require('express');
var router = express.Router();
var Usercontroller = require('./../controllers/users.controller');
var verifyToken = require('./../config/verifyToken');

router.post('/signup', Usercontroller.signup);
router.post('/login', Usercontroller.login);
router.get('/checkEmailAdmin/:email', Usercontroller.checkEmailAdmin);
router.get('/checkEmail/:email', Usercontroller.checkEmail);
router.get('/api/profile', verifyToken.ensureAuthenticated, Usercontroller.profile);
router.put('/api/me', verifyToken.ensureAuthenticated, Usercontroller.me);

router.post('/google', Usercontroller.google);
router.post('/github', Usercontroller.github);
router.post('/linkedin', Usercontroller.linkedin);
router.post('/facebook', Usercontroller.facebook);
router.post('/yahoo', Usercontroller.yahoo);
router.post('/twitter', Usercontroller.twitter);
router.post('/adminsignup', Usercontroller.adminsignup);
router.post('/adminlogin', Usercontroller.adminlogin);
router.post('/unlink', verifyToken.ensureAuthenticated, Usercontroller.unlink);

module.exports = router;