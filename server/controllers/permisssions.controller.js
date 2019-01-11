
'use strict';
var databse = require('./../config/database');
var _roleSchema = require('./../models/role');
var _userSchema = require('./../models/user');
var _masterSchema = require('./../models/master');
var config = require('./../config/auth-config');

exports.findAllActiveUsers = async function (req, res) {
    var userList = [];
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("User", _userSchema.userSchema);
    var userroletable = connection.model("UserRole", _roleSchema.roleSchema);
    await table.find({ IsDeleted: false, Active: true })
        .select({ _id: 1, email: 1 })
        .exec(function (err, users) {
            userroletable.findOne({ _id: req.params.roleId })
                .select({ Users: 1 })
                .exec(function (err, assignedrole) {
                    var u = assignedrole.Users;
                    for (var i = 0; i < users.length; i++) {
                        var friends = JSON.stringify(u).indexOf(users[i]._id);
                        userList.push(JSON.parse((JSON.stringify({
                            "IsRoleAssigned": friends == -1 ? false : true
                        }) + JSON.stringify(users[i])).replace(/}{/g, ",")));
                    }
                    res.send(userList);
                });
        });
};

exports.findAllActiveRoles = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var userroletable = connection.model("UserRole", _roleSchema.roleSchema);

    await userroletable.find({ IsDeleted: false, Active: true, "Users": req.params.userId })
        .select({ _id: 1, "Users.$": 1 })
        .exec()
        .then((info) => {
            res.send(info);
        })
        .catch((err) => {
            return 'error occured';
        });
};


exports.findUsersByRoles = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var userroletable = connection.model("UserRole", _roleSchema.roleSchema);
    var userroles;
    if (req.params.roleList !== undefined) {
        var ids = req.params.roleList.split(",");
        userroles = await userroletable.find({
            IsDeleted: false, Active: true, _id: { $in: ids }
        },
            { "_id": 1, Users: 1 })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
    }
    var userRoleList = [];
    if (userroles !== undefined && userroles !== null) {
        var tableuser = connection.model("User", _userSchema.userSchema);
        var lenrole = userroles.length;
        for (var indexrole = 0; indexrole < lenrole; indexrole++) {
            var item = userroles[indexrole];
            var users = await tableuser.find({
                IsDeleted: false, Active: true, _id: { $in: item.Users }
            })
                .select({ _id: 1, email: 1 })
                .exec()
                .then((info) => {
                    return info;
                })
                .catch((err) => {
                    return 'error occured';
                });
            var len = users.length;
            for (var index = 0; index < len; index++) {
                var user = users[index];
                var roleIndex = await JSON.stringify(userRoleList).indexOf(user._id);
                if (roleIndex < 0) {
                    userRoleList.push({ _id: user._id, email: user.email });
                }
            }
        }
        res.json(userRoleList);
    }
};

exports.findRoles = async function (req, res) {
    var query = (req.params.search === "empty" || req.params.search === null) ?
        { IsDeleted: false, Active: true } :
        { IsDeleted: false, Active: true, rolename: new RegExp(req.params.search, "i") }
    var userRoleList = [];
    var userIds = req.params.userId;

    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var userroletable = connection.model("UserRole", _roleSchema.roleSchema);
    var userroles;
    if (userIds !== undefined) {
        var ids = userIds.split(",");
        userroles = await userroletable.find({
            $and: [{ "Users": { $in: ids } },
                query]
        }, { "_id": 1 })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
    }

    await userroletable.find(query)
        .select({ _id: 1, rolename: 1, Users: 1 })
        .exec(function (err, roles) {
            userRoleList = roles;
            if (req.params.userId !== null && req.params.userId !== "empty") {
                if (userroles !== undefined && userroles !== null) {
                    var len = userroles.length;
                    for (var index = 0; index < len; index++) {
                        var item = userroles[index];
                        var roleIndex = userRoleList.findIndex(user => user._id === item._id);
                        if (roleIndex > -1) {
                            userRoleList[roleIndex] =
                                JSON.parse((JSON.stringify({ "IsRoleAssigned": true }) +
                                    JSON.stringify(userRoleList[roleIndex])).replace(/}{/g, ","));
                        }
                    }
                }
            }
            res.send(userRoleList);
        });
};

exports.findUsersSearch = async function (req, res) {
    var adminstatus = false;
    console.log("cate", req.params.usercategory);
    if (req.params.usercategory == 1) {
        adminstatus = true;
    }
    var query = (req.params.search === "empty" || req.params.search === null) ?
        { IsDeleted: false, Active: true, IsAdmin: adminstatus } :
        { IsDeleted: false, Active: true, IsAdmin: adminstatus, email: new RegExp(req.params.search, "i") };
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);

    var table = connection.model("User", _userSchema.userSchema);

    await table.find(query)
        .select({ _id: 1, email: 1 })
        .exec()
        .then((info) => {
            res.send(info);
        })
        .catch((err) => {
            return 'error occured';
        });
};

exports.findRoleForForms = async function (req, res) {
    var query = {
        IsDeleted: false, Active: true, rolename: new RegExp(req.params.search, "i")
    };

    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("UserRole", _roleSchema.roleSchema);
    await table.find(query)
        .select({ _id: 1, rolename: 1 })
        .exec()
        .then((info) => {
            res.send(info);
        })
        .catch((err) => {
            return err.err;
        });
};

exports.findAllActiveForms = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Master", _masterSchema.masterdataSchema);
    var formList = [];

    await table.find({
        "Roles.RoleId": {
            "$ne": req.params.roleId
        }, IsDeleted: false,
        Active: true, IsForm: true

    })
        .select({ _id: 1, FormName: 1 })
        .exec()
        .then((info) => {
            if (info.length > 0)
                formList = info;

        })
        .catch((err) => {
            return 'error occured';
        });

    var unassignedforms = await table.find({
        "Roles.RoleId": req.params.roleId, IsDeleted: false,
        Active: true, IsForm: true
    })
        .select({ _id: 1, FormName: 1, "Roles.$": 1 })
        .exec()
        .then((info) => {
            return info;
        });
    if (unassignedforms !== null) {
        var len = unassignedforms.length
        var row;
        for (var index = 0; index < len; index++) {
            row = unassignedforms[index];

            await formList.push({
                _id: row._id,
                FormName: row.FormName,
                Add: row.Roles[0].FormPermissions.Add,
                View: row.Roles[0].FormPermissions.View,
                Delete: row.Roles[0].FormPermissions.Delete,
                Report: row.Roles[0].FormPermissions.Report,
                Edit: row.Roles[0].FormPermissions.Edit
            });
        }
    }
    res.send(formList);
};

exports.saveusermapping = async function (req, res) {
    var items = req.body;
    var len = req.body.length;
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("UserRole", _roleSchema.roleSchema);
    for (var index = 0; index < len; index++) {
        var item = items[index];
        var roles = await table.find({ '_id': item._id }, { "Users": 1 })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                res.json({ success: false, message: err.err });
            });
        if (roles !== null || roles !== "undefined") {
            // var userslen = item.Users.length;
            var usersList = [];
            usersList = item.Users
            // for (var indexUsers = 0; indexUsers < userslen; indexUsers++) {
            //     var userindex = roles.Users.findIndex(user => user === item.Users[indexUsers]);
            //     console.log(userindex);
            //     if (userindex === -1) {
            //         await usersList.push(item.Users[indexUsers]);
            //     }
            // }
            if (usersList.length > 0) {
                await table.update({ '_id': item._id },
                    {
                        '$set': { Users: usersList }
                    })
                    .exec()
                    .then()
                    .catch((err) => {
                        res.json({ success: false, message: err.err });
                    });
            }
        }
    }
    res.json({ success: true });
};

exports.saveFormPermissions = async function (req, res) {
    // var idList = JSON.stringify(req.params._id).split(",").map(function (item) {
    //     console.log(item);
    //     return parseInt(item.replace(new RegExp('\"', 'g'), ""));
    // });
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Master", _masterSchema.masterdataSchema);

    var len = req.body.length;
    for (var index = 0; index < len; index++) {
        var item = req.body[index];
        var masters = await table.findOne({ '_id': item._id, "Roles.RoleId": item.Roles.RoleId },
            { "Roles.$.FormPermissions": 1 })
            .exec()
            .then((masters) => {
                return masters;
            })
            .catch((err) => {
                return err.err;
            });

        if (masters === null) {
            await table.update({ '_id': item._id },
                {
                    '$addToSet': {
                        Roles: {
                            RoleId: item.Roles.RoleId,
                            FormPermissions: item.Roles.FormPermissions
                        }
                    }
                }).thn(function (res) {
                })
                .catch((err) => {
                    return err.err;
                });
        }
        else {
            await table.update({ '_id': item._id, "Roles.RoleId": item.Roles.RoleId },
                {
                    '$set': {
                        "Roles.$.FormPermissions": item.Roles.FormPermissions
                    }
                }).then(function (res) {
                })
                .catch((err) => {
                    return err.err;
                });
        }

    }

    res.json({ success: true, message: "Saved Successfully..." });
    // var arr1 = Array.prototype.map.call(arr, function (obj) {
    //     console.log(obj);
    //     return parseInt( obj.sp);
    // });
    // var arr1 = idList.map(function (item) {
    //     console.log(item);
    //     return parseInt(item);
    // });

    // console.log(arr1);
    // var query = Master.updateMany(
    //     { '_id': { $in: idList}  },
    //     { '$set': { 'Roles': req.body.map(function (item) {
    //         console.log(item);
    //   return      item.Roles;
    //     })} },
    //     { multi: true, upsert: true, new: true }
    // );

    // query.exec(function (error) {
    //     if (error) {
    //         return res.json({ success: false, message: 'failed!' }); // Return success
    //     }
    //     return res.send();
    // });
};

exports.saveformdesignmapping = async function (req, res) {
    var formDesignList = req.body;
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Master", _masterSchema.masterdataSchema);

    var form = await table.findONe({ '_id': req.params._id }, { "FormDesignId": 1 })
        .exec()
        .then((info) => {
            return info;
        })
        .catch((err) => {
            res.json({ success: false, message: err.err });
        });

    if (form !== null && form !== "undefined" && formDesignList.length > 0) {
            await table.update({ '_id': req.params._id },
                {
                    '$set': { FormDesignId: formDesignList }
                })
                .exec()
                .then()
                .catch((err) => {
                    res.json({ success: false, message: err.err });
                });
    }
    res.json({ success: true });
};