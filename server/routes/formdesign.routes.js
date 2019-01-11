'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./../controllers/formdesign.controller');
var verifyToken = require('./../config/verifyToken');

router.post('/save', verifyToken.ensureAuthenticatedAdmin, controller.Save);
router.put('/delete/(:_id*)', verifyToken.ensureAuthenticatedAdmin, controller.Delete);
router.put('/update/:_id', verifyToken.ensureAuthenticatedAdmin, controller.Update);
router.get('/FindById/:_id', verifyToken.ensureAuthenticatedAdmin, controller.FindById);
router.get('/findPageWise/:page/:searchField/:searchValue', verifyToken.ensureAuthenticatedAdmin, controller.FindPageWise)
module.exports = router;