'use strict';

var express = require('express');
var router = express.Router();
var controller = require('../controllers/communication.controller');

router.post('/sendemail', controller.sendemail);
router.post('/sendSms', controller.sendSms);

module.exports = router;