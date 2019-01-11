'use strict';

var _ = require('lodash');
var constants = require('./../config/constants');
var User = require('./../models/user');
var databse = require('./../config/database');
var config = require('./../config/auth-config');

exports.Save = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("User", User.userSchema);
    // Check if rolename was provided
    if (!req.body.rolename) {
        res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
    } else {

        let tabl = new table({
            _id: req.body._id,
            rolename: req.body.rolename,
            createdBy: req.body.createdBy
        });
        await tabl.save((err) => {
            if (err) {
                if (err.rolename === 11000) {
                    res.json({ success: false, message: 'Role name or e-mail already exists' }); // Return error
                } else {
                    if (err.errors) {
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
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("User", User.userSchema);
    await table.remove({ _id: req.params.id }, function (err, user) {
        if (err) {
            res.json({ success: false, message: err }); // Return any other error not already covered
        } else {
            res.json({ success: true, message: 'Deleted successfully!' }); // Return success
        }
    });
};

exports.FindById = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("User", User.userSchema);
    await table.findById({ _id: req.params._id })
        .exec()
        .then((info) => {
            res.send(info);
        })
        .catch((err) => {
            return 'error occured';
        });
};

exports.FindMaxId = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("User", User.userSchema);

    await table.find({}, { _id: 1 })
        .sort({ _id: -1 })
        .limit(1)
        .exec()
        .then((info) => {
            res.send(info);
        })
        .catch((err) => {
            return 'error occured';
        });
};

exports.Findall = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("User", User.userSchema);

    await table.find({ IsDeleted: false })
        .exec()
        .then((info) => {
            res.send(info);
        })
        .catch((err) => {
            return 'error occured';
        });
};

exports.FindPageWise = async function (req, res) {
    var currPage = req.params.page;
    var total = 0;  var noOfRecords = (currPage - 1) * constants.PagSize;
    if (noOfRecords !== NaN && noOfRecords > -1) {
        var connection=databse.getDatabaseConnection(config.DefaultDatabse);
        var table = connection.model("User", User.userSchema);
        var query = { IsAdmin: adminstatus, IsDeleted: false, Active: true };
        var adminstatus = false;
        console.log("cate", req.params.usercategory);
        if (req.params.usercategory == 1) {
            adminstatus = true;
        }
        console.log("cate", req.params.usercategory);
        // if (req.params.usercategory == 1) {
        //     console.log("1 in");
        //     connection = databse.getDatabaseConnection(config.DefaultDatabse);
        // } else if (req.params.usercategory == 2) {
        //     console.log("2 in");
        //     connection = databse.getDatabaseConnection(config.DefaultClientDatabse);
        // } else {
        //     console.log("defa");
        //     connection = databse.getDatabaseConnection(req.headers['key-basedata']);
        // }
        console.log(currPage);
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
            .sort({ ModifiedDate: -1 })
            .skip(noOfRecords)
            .limit(constants.PagSize)
            .exec()
            .then((info) => {
                res.send({ "Pages": info, "Total": total });

            })
            .catch((err) => {
                return 'error occured';
            });
    }
};

exports.Update = async function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
};

