
'use strict';
var databse = require('./../config/database');
var _roleSchema = require('./../models/role');
var _userSchema = require('./../models/user');
var _masterSchema = require('./../models/master');
var config = require('./../config/auth-config');

exports.checkFormPermission = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var usertable = connection.model("User", _userSchema.userSchema);
    var mastertable = connection.model("Master", _masterSchema.masterdataSchema);
    var userroletable = connection.model("UserRole", _roleSchema.roleSchema);

    var email = req.params.email;
    var userId = await usertable.findOne({ IsDeleted: false, Active: true, email: email })
        .select({ _id: 1 })
        .exec()
        .then((info) => {
            console.log(info);
            return info;
        })
        .catch((err) => {
            return 'error occured';
        });


    var userRole = await userroletable.find({ IsDeleted: false, Active: true, Users: userId._id })
        .select({ _id: 1 })
        .exec()
        .then((info) => {
            console.log(info);
            return info;
        })
        .catch((err) => {
            return 'error occured';
        });

    var roleIds = userRole.map(function (item) {
        return parseInt(item._id);
    });
    console.log(roleIds);
    var form = await mastertable.findOne({
        _id: req.params.form,
        "Roles.RoleId": { $in: roleIds }, IsDeleted: false,
        Active: true, IsForm: true
    })
        .select({ "Roles.$": 1 })
        .exec()
        .then((info) => {
            console.log(info);
            return info;
        });


    res.send(form);
};
