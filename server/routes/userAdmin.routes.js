'use strict';
var express = require('express');
var router = express.Router();
var Usercontroller = require('./../controllers/usersAdmin.controller');
var verifyToken = require('./../config/verifyToken');

router.post('/save', verifyToken.ensureAuthenticatedAdmin, Usercontroller.Save);
router.delete('/delete/:_id', verifyToken.ensureAuthenticatedAdmin, Usercontroller.Delete);
router.put('/update/:_id', verifyToken.ensureAuthenticatedAdmin, Usercontroller.Update);
router.get('/findById/:_id', verifyToken.ensureAuthenticatedAdmin, Usercontroller.FindById);
router.get('/findMaxId', verifyToken.ensureAuthenticatedAdmin, Usercontroller.FindMaxId);
router.get('/findPageWise/:page/:usercategory', verifyToken.ensureAuthenticatedAdmin,Usercontroller.FindPageWise)

module.exports = router;