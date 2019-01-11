
'use strict';

var _formdesigntable = require('./../models/formdesign');
var constants = require('./../config/constants');
var config = require('./../config/auth-config');
var databse = require('./../config/database');
var _masterSchema = require('./../models/master');

exports.Save = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);

    var table = connection.model("FormDesign", _formdesigntable.formdesignSchema);
    // Check if email was provided
    if (!req.body.Title) {
        res.json({ success: false, message: 'You must provide an Title' }); // Return error
    } else {
        // Check if username was provided
        if (!req.body.DesignContent) {
            res.json({ success: false, message: 'You must provide a DesignContent' }); // Return error
        } else {
            let data = new table({
                _id: req.body._id,
                Title: req.body.Title,
                Columns: req.body.Columns,
                Style: req.body.Style,
                FormContent: req.body.FormContent,
                DesignContent: req.body.DesignContent,
                CreatedBy: req.body.CreatedBy
            }); 
            await data.save((err) => {
                if (err) {
                    // Check if error is an error indicating duplicate account
                    if (err.Title === 11000) {
                        res.json({ success: false, message: 'Title already exists' }); // Return error
                    } else {
                        // Check if error is a validation rror
                        if (err.errors) {
                            // Check if validation error is in the email field
                            if (err.errors.Title) {
                                res.json({ success: false, message: err.errors.Title.message }); // Return error
                            } else {
                                // Check if validation error is in the name field
                                if (err.errors.DesignContent) {
                                    res.json({ success: false, message: err.errors.DesignContent.message }); // Return error
                                } else {
                                    res.json({ success: false, message: err }); // Return any other error not already covered
                                }
                            }

                        } else {
                            res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                        }
                    }
                } else {
                    console.log("7");
                    res.json({ success: true, message: 'Acount registered!' }); // Return success
                }
            });
        }
    }
};

exports.Update = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("FormDesign", _formdesigntable.formdesignSchema);
    await table.findByIdAndUpdate(req.params._id,
        {
            $set: {
                Title: req.body.Title,
                Columns: req.body.Columns,
                Style: req.body.Style,
                FormContent: req.body.FormContent,
                DesignContent: req.body.DesignContent,
            },
            $push: {
                Modified: {
                    ModifiedBy: req.body.ModifiedBy
                }
            }
        }, function (err, data) {
            if (err) {
                if (err.errors) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: false, message: 'Could not save data. Error: ', err });
                }
            } else {
                res.json({ success: true, message: 'Saved successfully!' });
            }
        });
};

exports.Delete = async function (req, res) {
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("FormDesign", _formdesigntable.formdesignSchema);
    var mastertable = connection.model("Master", _masterSchema.masterdataSchema);

    var ids = req.params._id.split(",");
    console.log(ids);
    var reference = await mastertable.count({
        "FormDesignId": { "$in": ids },
        IsDeleted: false, Active: true
    })
        .then(function (res) {
            return res;
        })
        .catch((err) => {
        });
    console.log(reference);
    if (reference === 0) {
        await table.updateMany({ "_id": { "$in": ids } },
            { "$set": { IsDeleted: true, DeletedBy: req.body.DeletedBy } })
            .then(function (res) {
                res.send({ success: true, message: 'Deleted successfully!' });
            })
            .catch((err) => {
            });
    }
    else {
        res.send({ success: false, message: 'Reference exists...' });
    }
};

exports.FindById = async function (req, res) {
    var _id = req.params._id;
    var connection = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = connection.model("FormDesign", _formdesigntable.formdesignSchema);

    if (_id > 0) {
        console.log("1");
        await table.findOne({ IsDeleted: false, Active: true, _id: _id })
            .select({ FormContent: 1, Modified: 1, Title: 1, Columns: 1, Style: 1, DesignContent: 1 })
            .exec()
            .then((info) => {
                console.log(info);
                res.json({ maxIdData: null, editRow: info });
            })
            .catch((err) => {
                res.json({ message: err });
            });
    }
    else {
        await table.find({ IsDeleted: false, Active: true })
            .select({ _id: 1 })
            .sort({ _id: -1 })
            .limit(1)
            .exec()
            .then((info) => {
                res.json({ maxIdData: info, editRow: null });
            })
            .catch((err) => {
                res.json({ message: err });
            });
    }
};

exports.FindPageWise = async function (req, res) {
    var total = 0; var currPage = req.params.page;
    var noOfRecords = (currPage - 1) * constants.PagSize;
    var order = constants.TableSorting.FormDesign.Order;
    var sordField = constants.TableSorting.FormDesign.Field;
    var searchField = req.params.searchField;
    var searchValue = req.params.searchValue;
    var query;
    if (noOfRecords !== NaN && noOfRecords > -1) {
        var connection = databse.getDatabaseConnection(req.headers['key-basedata']);

        var table = connection.model("FormDesign", _formdesigntable.formdesignSchema);

        query = { IsDeleted: false };
        if (searchValue !== 'undefined' && searchValue !== "" && searchValue !== null) {
            query[searchField] = new RegExp(searchValue, "i");
        }

        console.log(currPage);
        if (currPage == 1) {
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
            .sort({ sordField: order })
            .skip(noOfRecords)
            .limit(constants.PagSize)
            .exec(function (err, table) {
                res.json({ "Pages": table, "Total": total });
            });
    }
};
