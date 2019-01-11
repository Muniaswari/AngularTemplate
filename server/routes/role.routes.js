'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./../controllers/role.controller');
var verifyToken = require('./../config/verifyToken');

router.post('/save', verifyToken.ensureAuthenticatedAdmin, controller.Save);
router.delete('/delete/:id', verifyToken.ensureAuthenticatedAdmin, controller.Delete);
router.put('/update/:id', verifyToken.ensureAuthenticatedAdmin, controller.Update);
router.get('/findById/:email', verifyToken.ensureAuthenticatedAdmin, controller.FindById);
router.get('/FindallRoles/:_id', verifyToken.ensureAuthenticatedAdmin, controller.FindallRoles);
router.get('/findall', verifyToken.ensureAuthenticatedAdmin, controller.Findall);
router.get('/findPageWise/:page/:searchField/:searchValue', verifyToken.ensureAuthenticatedAdmin, controller.FindPageWise)
module.exports = router;