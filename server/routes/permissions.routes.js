'use strict';
var express = require('express');
var router = express.Router();
var controller = require('./../controllers/permisssions.controller');
var verifyToken = require('./../config/verifyToken');

router.put('/saveusermapping/(:_id*)', verifyToken.ensureAuthenticatedAdmin,controller.saveusermapping);
router.put('/saveformpermissions/(:_id*)', verifyToken.ensureAuthenticatedAdmin, controller.saveFormPermissions);
// router.post('/saveformpermission', verifyToken.ensureAuthenticated, Usercontroller.Save);
router.get('/findAllActiveUsers/:roleId', verifyToken.ensureAuthenticatedAdmin, controller.findAllActiveUsers);
router.get('/findAllActiveForms/:roleId', verifyToken.ensureAuthenticatedAdmin, controller.findAllActiveForms);
router.get('/findAllActiveRoles/:userId', verifyToken.ensureAuthenticatedAdmin, controller.findAllActiveRoles);
router.get('/findRoles/:search/(:userId*)', verifyToken.ensureAuthenticatedAdmin, controller.findRoles);
router.get('/findUsersByRoles/(:roleList*)', verifyToken.ensureAuthenticatedAdmin, controller.findUsersByRoles);
router.get('/findRoleForForms/:search', verifyToken.ensureAuthenticatedAdmin, controller.findRoleForForms);
router.get('/findUsersSearch/:search/:usercategory', verifyToken.ensureAuthenticatedAdmin, controller.findUsersSearch);

module.exports = router;