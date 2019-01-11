'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./../controllers/master.controller');
var verifyToken = require('./../config/verifyToken');

router.post('/save', verifyToken.ensureAuthenticatedAdmin, controller.Save);
router.put('/delete/(:_id*)', verifyToken.ensureAuthenticatedAdmin, controller.Delete);
router.put('/update/:_id', verifyToken.ensureAuthenticatedAdmin, controller.Update);
router.get('/findById/:_id', verifyToken.ensureAuthenticatedAdmin, controller.FindById);
router.get('/findall', verifyToken.ensureAuthenticatedAdmin, controller.Findall);
router.get('/findPageWise/:page/:category/:searchField/:searchValue', verifyToken.ensureAuthenticatedAdmin, controller.FindPageWise)
router.get('/checkDuplication/:FormName/:_id', verifyToken.ensureAuthenticatedAdmin, controller.checkDuplication);
router.get('/tablecolumns/:tableName', verifyToken.ensureAuthenticatedAdmin, controller.TableColumns);

module.exports = router;