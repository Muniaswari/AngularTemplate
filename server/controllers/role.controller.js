'use strict';

var constants = require('./../config/constants');
var async = require('async');
var databse = require('./../config/database');
var _roleSchema = require('./../models/role');

exports.Save = async function (req, res) {
    // Check if rolename was provided
    if (!req.body.rolename) {
        res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
    } else {
        var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
        var table = connection.model("UserRole", _roleSchema.roleSchema);

        let tabl = new table({
            _id: req.body._id,
            rolename: req.body.rolename,
            description: req.body.description,
            roleparentid: req.body.roleparentid,
            CreatedBy: req.body.CreatedBy,
        });
        await tabl.save((err) => {
            if (err) {
                // Check if error is an error indicating duplicate account
                if (err.rolename === 11000) {
                    res.json({ success: false, message: 'Role name or e-mail already exists' }); // Return error
                } else {
                    // Check if error is a validation rror
                    if (err.errors) {
                        // Check if validation error is in the rolename field
                        if (err.errors.rolename) {
                            res.json({ success: false, message: err.errors.rolename.message }); // Return error
                        } else {
                            res.json({ success: false, message: err }); // Return any other error not already covered
                        }

                    } else {
                        res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                    }
                }
            } else {
                res.json({ success: true, message: 'Acount registered!' }); // Return success
            }
        });
    }
};

exports.Delete = async function (req, res) {
    console.log("entry");
    var db = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("UserRole", _roleSchema.roleSchema);
    var ids = req.params._id.split(",");
    console.log(ids);
    var reference = await table.count({
        "Category": { "$in": ids },
        IsDeleted: false, Active: true
    })
        .then(function (res) {
            return res;
        })
        .catch((err) => {
        });
    console.log(reference);
    if (reference === 0) {
        console.log("up in");
        await table.updateMany({ "_id": { "$in": ids } },
            { "$set": { IsDeleted: true, DeletedBy: req.body.DeletedBy } })
            .then(function (res) {
                console.log("s");
                res.send({ success: true, message: 'Deleted successfully!' });
            })
            .catch((err) => {
                console.log(err);
                res.send({ success: false, message: err });
            });
    }
    else {
        res.send({ success: false, message: 'Reference exists...' });
    }
};

exports.FindById = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("UserRole", _roleSchema.roleSchema);
    await table.findOne({ _id: req.params._id })
        .exec()
        .then((info) => {
            res.send(info);
        })
        .catch((err) => {
            return 'error occured';
        });
};

exports.Findall = async function (req, res) {
    var userRoleList = [];
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("UserRole", _roleSchema.roleSchema);
    var usertable = connection.model("User");
    await table.find({ IsDeleted: false, Active: true }, { _id: 1, rolename: 1, Users: 1 })
        .exec(function (err, userrole) {
            async.forEach(userrole, function (role, callback) {
                if (role.Users !== null) {
                    usertable.find({ _id: { $in: role.Users } }, { _id: 1, email: 1 },
                        function (err, users) {
                            if (users !== null) {
                                var info = JSON.parse(JSON.stringify({
                                    _id: role._id, rolename: role.rolename, Users: users.map(function (user) {
                                        return { _id: user._id, rolename: user.email };
                                    })
                                }));
                                userRoleList.push(info);
                            }
                            else { userRoleList.push(role); }
                            callback(); // Callback
                        })
                }
                else { userRoleList.push(role); }

            }, function () {
                res.json(userRoleList);
            });
        });
};

exports.FindallRoles = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("UserRole", _roleSchema.roleSchema);
    var max;
    var role;
    var _id = req.params._id;
    if (_id > 0) {
        role = await table.findOne({ IsDeleted: false, Active: true, _id: _id })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
    } else {
        max = await table.find({}, { _id: 1 })
            .sort({ _id: -1 })
            .limit(1)
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
    }
    await table.find({ IsDeleted: false, Active: true }, { _id: 1, rolename: 1 })
        .exec(function (err, userrole) {
            res.json({ "role": role, "roles": userrole, maxIdData: max });
        });
};


exports.Update = async function (req, res) {
    console.log(req.body);
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("UserRole", _roleSchema.roleSchema);

    await table.findByIdAndUpdate(req.params.id, {
        $set: {
            rolename: req.body.rolename,
            description: req.body.description,
            roleparentid: req.body.roleparentid
        },
        $push: {
            Modified: {
                ModifiedBy: req.body.ModifiedBy
            }
        },
    }, function (err, data) {
        if (err) {
            if (err.errors) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: false, message: 'Could not save  data.', Error:  err });
            }
        } else {
            res.json({ success: true, message: 'Saved successfully!' });
        }
    });      
    console.log("end");
};


exports.FindPageWise = async function (req, res) {
    try {
        var currPage = req.params.page;
        var noOfRecords = (currPage - 1) * constants.PagSize;
        var order = constants.TableSorting.UserRoles.Order;
        var sordField = constants.TableSorting.UserRoles.Field;
        var total = 0; var query;
        var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
        var table = connection.model("UserRole", _roleSchema.roleSchema);
        var searchField = req.params.searchField;
        var searchValue = req.params.searchValue;
        var total = 0;
        var query = {};
        console.log(req.params);
        if (noOfRecords !== NaN && noOfRecords > -1) {
            console.log("1");
            query['IsDeleted'] = false;

            if (searchValue !== 'undefined' && searchValue !== "" && searchValue !== null) {
                console.log("3");
                query[searchField] = new RegExp(searchValue, "i");
            }

            console.log(query);
            if (currPage == 1) {
                console.log("counter in");
                total = await table.count(query)
                    .exec()
                    .then((info) => {
                        console.log(info);
                        return info;
                    })
                    .catch((err) => {
                        return 'error occured';
                    });
            }
            await table.find(query)
                .select({
                    rolename: 1,
                    "Modified": { "$slice": -1 },// fetch last row from an array
                    CreatedBy: 1, CreatedDate: 1
                })
                .sort({ sordField: order })
                .skip(noOfRecords)
                .limit(constants.PagSize)
                .exec(function (err, table) {
                    res.json({ "Pages": table, "Total": total });
                });
        }
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
};
