
'use strict';

var express = require('express');
var _ = require('lodash');
var mongoose = require('mongoose');
var table = require('./../models/customer');
var master = require('./../models/master');
var constants = require('./../config/constants');
var config = require('./../config/auth-config');
var databse = require('./../config/database');

exports.custSave = function (req, res) {
    // Check if email was provided
    if (!req.body.email) {
        res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
    } else {
        // Check if username was provided
        if (!req.body.name) {
            res.json({ success: false, message: 'You must provide a name' }); // Return error
        } else {
            let customer = new Customer({
                email: req.body.email.toLowerCase(),
                name: req.body.name
            });
            customer.save((err) => {
                if (err) {
                    // Check if error is an error indicating duplicate account
                    if (err.email === 11000) {
                        res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
                    } else {
                        // Check if error is a validation rror
                        if (err.errors) {
                            // Check if validation error is in the email field
                            if (err.errors.email) {
                                res.json({ success: false, message: err.errors.email.message }); // Return error
                            } else {
                                // Check if validation error is in the name field
                                if (err.errors.name) {
                                    res.json({ success: false, message: err.errors.username.message }); // Return error
                                } else {
                                    res.json({ success: false, message: err }); // Return any other error not already covered
                                }
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
    }

};

exports.custDelete = function (req, res) {
    table.remove({ _id: req.params.id }, function (err, user) {
        if (err) {
            res.json({ success: false, message: err }); // Return any other error not already covered
        } else {
            res.json({ success: true, message: 'Deleted successfully!' }); // Return success
        }
    });
};

exports.custFindById = function (req, res) {
    table.findOne({ email: req.params.email }, (err, customer) => {
        res.send(customer);
    });
};

exports.custFindall = function (req, res) {
    table.find(req.customer, function (err, customer) {
        res.send(customer);
    });
};

exports.FindCountry = async function (req, res) {
    var db = databse.getDatabaseConnection(config.DefaultDatabse);

    var table = db.model("Master");
    var countrydata = await table.findOne({ FormName: 'Country' })
        .exec()
        .then((info) => {
            return info;
        })
        .catch((err) => {
            return 'error occured';
        });
    await table.find({ Category: countrydata._id })
        .exec()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            return 'error occured';
        });
};

exports.FindMaxId = async function (req, res) {
    await table.find({}, { _id: 1 })
        .sort({ _id: -1 })
        .limit(1)
        .exec(function (err, doc) {
            res.send(doc);
        });
};

exports.FindPageWise =async function (req, res) {
    var total = 0;  var currPage = req.params.page;
    var category = req.params.category === 'false' ? false : true;
    var noOfRecords = (currPage - 1) * constants.PagSize;
    var order = constants.TableSorting.Master.Order;
    var sordField = constants.TableSorting.Master.Field;
    var query;
    if (noOfRecords !== NaN && noOfRecords > -1) {
        if (category === true) {
            query = { IsDeleted: false, IsForm: true };
        }
        else {
            query = { IsDeleted: false };
        } 
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
     await   table.find(query)
            .sort({ sordField: order })
            .skip(noOfRecords)
            .limit(constants.PagSize)
            .exec(function (err, table) {
                res.json({ "Pages": table, "Total": total });
            });
    }
};

exports.custUpdate = function (req, res) {
    table.findByIdAndUpdate(req.params.id, req.body, function (err, cust) {
        if (err) return next(err);
        res.json(cust);
    });
};

