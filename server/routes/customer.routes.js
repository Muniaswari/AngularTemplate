'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./../controllers/customer.controller');
var verifyToken = require('./../config/verifyToken');

router.post('/save', verifyToken.ensureAuthenticated,controller.custSave);
router.delete('/delete/:id', verifyToken.ensureAuthenticated, controller.custDelete);
router.put('/update/:id', verifyToken.ensureAuthenticated,controller.custUpdate);
router.get('/findById/:email', verifyToken.ensureAuthenticated, controller.custFindById);
router.get('/findall', verifyToken.ensureAuthenticated, controller.custFindall);
router.get('/findCountry',  controller.FindCountry);
router.get('/findPageWise/:page', verifyToken.ensureAuthenticated,  controller.FindPageWise)
router.get('/findMaxId', verifyToken.ensureAuthenticated, controller.FindMaxId);

module.exports = router;