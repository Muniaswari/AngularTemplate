
'use strict';
var constants = require('./../config/constants');
var databse = require('./../config/database');
var _masterSchema = require('./../models/master');
var _formdesignSchema = require('./../models/formdesign');

exports.Save = async function (req, res) {
    var db = databse.getDatabaseConnection(req.headers['key-basedata']);

    var table = db.model("Master", _masterSchema.masterdataSchema);

    if (!req.body.FormName) {
        res.json({ success: false, message: 'You must provide a Form Name' });
    } else {
        let data = new table({
            _id: req.body._id,
            FormName: req.body.FormName,
            Description: req.body.Description,
            CreatedBy: req.body.CreatedBy,
            IsForm: req.body.IsForm,
            IsData: req.body.IsData,
            RouteUrl: req.body.RouteUrl,
            Category: req.body.Category
        });
        await data.save((err) => {
            if (err) {
                if (err.FormName === 11000) {
                    res.json({ success: false, message: 'Form Name already exists' });
                } else {
                    if (err.errors) {
                        res.json({ success: false, message: err });
                    } else {
                        res.json({ success: false, message: 'Could not save master data. Error: ', err });
                    }
                }
            } else {
                res.json({ success: true, message: 'Saved successfully!' });
            }
        });
    }
};

exports.TableColumns = async function (req, res) {
    var db = databse.getDatabaseConnection(req.headers['key-basedata']);
    var formdesignschema = db.model("FormDesign", _formdesignSchema.formdesignSchema);
    var table = db.model(req.params.tableName);
    var fields = [];
    table.schema.eachPath(function (path) {
        fields.push(path);
    });

    var formdesigns = await formdesignschema.find({ IsDeleted: false, Active: true })
        .select({ _id: 1, Title: 1 })
        .exec()
        .then((info) => {
            console.log(info);
            return info;
        })
        .catch((err) => {
            return 'error occured';
        });

    res.send({ "TableColumns": fields, "FormDesignList": formdesigns });
}

exports.Update = async function (req, res) {
    var db = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = db.model("Master", _masterSchema.masterdataSchema);
    await table.findByIdAndUpdate(req.params._id,
        {
            $set: {
                FormName: req.body.FormName,
                IsData: req.body.IsData,
                IsForm: req.body.IsForm,
                Description: req.body.Description,
                Category: req.body.Category,
                RouteUrl: req.body.RouteUrl
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
                    res.json({ success: false, message: 'Could not save master data. Error: ', err });
                }
            } else {
                res.json({ success: true, message: 'Saved successfully!' });
            }
        });

};

exports.Delete = async function (req, res) {
    console.log("entry");
    var db = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = db.model("Master", _masterSchema.masterdataSchema);
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
    var _id = req.params._id;
    console.log(req.params._id);
    var db = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = db.model("Master", _masterSchema.masterdataSchema);
    var editrowdata = null;
    var maxIddata = null;

    if (_id > 0) {
        console.log("1");
        editrowdata = await table.findOne({ IsDeleted: false, Active: true, _id: _id })
            .select({ FormName: 1, Modified: 1, IsData: 1, IsForm: 1, Description: 1, Category: 1, RouteUrl: 1 })
            .exec()
            .then((info) => {
                console.log(info);
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
    }
    else {
        console.log("2");
        maxIddata = await table.find({ IsDeleted: false, Active: true })
            .select({ _id: 1 })
            .sort({ _id: -1 })
            .limit(1)
            .exec()
            .then((info) => {
                console.log(info);
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
    }
    console.log("3");
    await table.find({ IsDeleted: false, Active: true })
        .select({ _id: 1, FormName: 1 })
        .exec(function (err, doc) {
            console.log("4");
            res.json({ maxIdData: maxIddata, list: doc, editRow: editrowdata });
        });
};

exports.checkDuplication = async function (req, res) {
    var db = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = db.model("Master", _masterSchema.masterdataSchema);
    var id = req.params._id;
    var query = {};

    query['IsDeleted'] = false;
    query['Active'] = true;
    query['FormName'] = new RegExp(`^${req.params.FormName}$`, 'i');
    if (id > 0) {
        query['_id'] = { $ne: Number(id) };
    }
    console.log(query);
    await table.findOne(query)
        .exec()
        .then((info) => {
            if (info) {
                res.json({ success: false, message: 'Form Name is already taken' });
            } else {
                res.json({ success: true, message: 'Form Name is available' });
            }
        })
        .catch((err) => {
            res.json({ success: false, message: err });
        });
};

exports.Findall = async function (req, res) {
    var db = databse.getDatabaseConnection(req.headers['key-basedata']);
    var table = db.model("Master", _masterSchema.masterdataSchema);
    await table.find({ IsDeleted: false })
        .select({ _id: 1, FormName: 1 })
        .exec(function (err, doc) {
            res.send(doc);
        });
};

exports.FindPageWise = async function (req, res) {
    try {
        var db = databse.getDatabaseConnection(req.headers['key-basedata']);
        var table = db.model("Master", _masterSchema.masterdataSchema);
        var currPage = req.params.page;
        var category = req.params.category === 'false' ? false : true;
        var noOfRecords = (currPage - 1) * constants.PagSize;
        var order = constants.TableSorting.Master.Order;
        var sordField = constants.TableSorting.Master.Field;
        var searchField = req.params.searchField;
        var searchValue = req.params.searchValue;
        var total = 0;
        var query = {};
        console.log(req.params);
        if (noOfRecords !== NaN && noOfRecords > -1) {
            console.log("1");
            query['IsDeleted'] = false;
            if (category === true) {
                console.log("2");
                query['IsForm'] = true;
            }

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
                    FormName: 1, IsData: 1, IsForm: 1,
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