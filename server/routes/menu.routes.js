'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./../controllers/menu.controller');
var verifyToken = require('./../config/verifyToken');

router.post('/save', verifyToken.ensureAuthenticatedAdmin, controller.Save);
router.delete('/delete/(:_id*)', verifyToken.ensureAuthenticatedAdmin, controller.Delete);
router.put('/update/:_id', verifyToken.ensureAuthenticatedAdmin, controller.Update);
router.get('/findById/:_id', verifyToken.ensureAuthenticatedAdmin, controller.FindById);
router.get('/findall', verifyToken.ensureAuthenticatedAdmin, controller.Findall);
router.get('/findMenus/:email', verifyToken.ensureAuthenticated, controller.findMenus);
router.get('/findData/:_id', verifyToken.ensureAuthenticatedAdmin, controller.FindData);
router.get('/checkDuplication/:menuName/:_id', verifyToken.ensureAuthenticatedAdmin, controller.checkDuplication);
module.exports = router;