'use strict';
var express = require('express');
var router = express.Router();
var controller = require('./../controllers/userpermisssions.controller');
var verifyToken = require('./../config/verifyToken');

router.get('/checkFormPermission/:form/:email', verifyToken.ensureAuthenticated, controller.checkFormPermission);

module.exports = router;