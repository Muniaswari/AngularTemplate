
'use strict';
var databse = require('./../config/database');
var config = require('./../config/auth-config');
var menu = require('./../models/menu');
var _masterSchema = require('./../models/master');
var _userSchema = require('./../models/user');
var _roleSchema = require('./../models/role');

exports.Save = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Menu", menu.menuSchema);

    if (!req.body.MenuName) {
        res.json({ success: false, message: 'You must provide a Menu Name' });
    } else {
        let data = new table({
            _id: req.body._id,
            MenuName: req.body.MenuName,
            LinkwithForm: req.body.LinkwithForm,
            ParentId: req.body.ParentId,
            RouteUrl: req.body.RouteUrl,
            Order: req.body.Order,
            Icon: req.body.Icon,
            CreatedBy: req.body.CreatedBy
        });
        await data.save((err) => {
            if (err) {
                if (err.MenuName === 11000) {
                    res.json({ success: false, message: 'Menu Name already exists' });
                } else {
                    if (err.errors) {
                        res.json({ success: false, message: err });
                    } else {
                        res.json({ success: false, message: 'Could not save Menu data. Error: ', err });
                    }
                }
            } else {
                res.json({ success: true, message: 'Saved successfully!' });
            }
        });
    }
};

exports.Update = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Menu");
     
    await table.findByIdAndUpdate(req.params._id,
        {
            $set: {
                MenuName: req.body.MenuName,
                LinkwithForm: req.body.LinkwithForm,
                ParentId: req.body.ParentId,
                RouteUrl: req.body.RouteUrl,
                Order: req.body.Order,
                Icon: req.body.Icon
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
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Menu");
    var ids = req.params._id.split(",");
    console.log(ids);
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
};

exports.FindById = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Menu");
    await table.findById({ _id: req.params._id }, (err, data) => {
        res.send(data);
    });
};

exports.FindData = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Menu");
    var mastertable = connection.model("Master", _masterSchema.masterdataSchema);

    var menu = await table.findOne({ _id: req.params._id, IsDeleted: false, Active: true })
        .select({ _id: 1, MenuName: 1, RouteUrl: 1, ParentId: 1,
             LinkwithForm: 1, Icon: 1, Order: 1,Modified:1 })
        .exec()
        .then((info) => {
            console.log(info);
            return info;
        })
        .catch((err) => {
            return err.err;
        });

    var forms = await mastertable.find({ IsDeleted: false, Active: true, IsForm: true })
        .select({ _id: 1, FormName: 1 })
        .exec()
        .then((info) => {
            return info;
        })
        .catch((err) => {
            return err.err;
        });
    var menus = await table.find({ IsDeleted: false, Active: true }, { _id: 1, MenuName: 1 })
        .sort({ Order: -1 })
        //  .limit(1)
        .exec(function (err, data) {
            console.log(data);
            var max = data === null || data === undefined ? null : data[0];
            res.json({ "maxId": max, "menus": data, "forms": forms, "editmenu": menu });
        })
        .catch((err) => {
            return err.err;
        });
};

exports.findMenus = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Menu", menu.menuSchema);
    var usertable = connection.model("User", _userSchema.userSchema);
    var mastertable = connection.model("Master", _masterSchema.masterdataSchema);
    var userroletable = connection.model("UserRole", _roleSchema.roleSchema);
    var menulist = [];
    var email = req.params.email;
    console.log("menu 1");
    var userId = await usertable.findOne({ IsDeleted: false, Active: true, email: email })
        .select({ _id: 1 })
        .exec()
        .then((info) => {
            return info;
        })
        .catch((err) => {
            return 'error occured';
        });
    console.log("m2");
    if (userId !== undefined && userId !== null) {
        var userRole = await userroletable.find({ IsDeleted: false, Active: true, Users: userId._id })
            .select({ _id: 1 })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
        console.log("m3");
        var rolesforUser = Array.prototype.map.call(userRole, function (obj) {
            return obj._id;
        });

        var forms = await mastertable.aggregate(
            { $unwind: "$Roles" },
            {
                $match: {
                    IsDeleted: false, Active: true, IsForm: true,
                    "Roles.RoleId": { "$in": rolesforUser },
                    $or: [{ "Roles.FormPermissions.Add": true },
                    { "Roles.FormPermissions.Edit": true },
                    { "Roles.FormPermissions.Delete": true },
                    //   { "Roles.FormPermissions.Report": true },
                    { "Roles.FormPermissions.View": true }]
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    'FormName': { $first: '$FormName' },

                    'Roles': { $first: '$Roles' },
                }
            },
            {
                $project: {
                    _id: 1,
                    // FormName: 1,
                    "Roles": 1
                }
            })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
        var formList = [];
        formList = forms;

        var formIds = formList.map(function (item) {
            return parseInt(item._id);
        });
        formIds.push(0);

        var parentmenus = await table.find({
            $and: [
                {
                    IsDeleted: false, Active: true, ParentId: 0,
                    LinkwithForm: { $in: formIds }
                }]
        })
            .select({ _id: 1, MenuName: 1, LinkwithForm: 1, RouteUrl: 1, Icon: 1 })
            .sort({ Order: 1 })
            .exec()
            .then((info) => {
                return info;
            })
            .catch((err) => {
                return 'error occured';
            });
        console.log(forms);
        if (parentmenus !== null) {
            var len = parentmenus.length;
            for (var index = 0; index < len; index++) {
                var item = parentmenus[index];
                var formpermission = formList.findIndex(form => form._id === item.LinkwithForm);

                var sunmenu = await table.find({
                    IsDeleted: false, Active: true, ParentId: item._id,
                    LinkwithForm: { $in: formIds }
                })
                    .select({ _id: 1, MenuName: 1, LinkwithForm: 1, RouteUrl: 1, Icon: 1 })
                    .sort({ Order: 1 })
                    .exec()
                    .then((info) => {
                        return info;
                    })
                    .catch((err) => {
                        return 'error occured';
                    });
                var submenulist = [];
                if (sunmenu !== null) {
                    var submenulen = sunmenu.length;
                    for (var indexsubmenu = 0; indexsubmenu < submenulen; indexsubmenu++) {
                        // submenulist.length=0;
                        var itemsub = sunmenu[indexsubmenu];
                        var formpermissionsub = formList.findIndex(form => form._id === itemsub.LinkwithForm);
                        if (formpermissionsub > -1) {
                            await submenulist.push({
                                _id: itemsub._id,
                                MenuName: itemsub.MenuName,
                                RouteUrl: itemsub.RouteUrl,
                                Icon: itemsub.Icon,
                                SubMenu: [],
                                LinkwithForm: itemsub.LinkwithForm,
                                Permission: formList[formpermissionsub].Roles
                            })
                        }
                    }
                }

                menulist[index] = {
                    _id: item._id,
                    MenuName: item.MenuName,
                    RouteUrl: item.RouteUrl,
                    Icon: item.Icon,
                    SubMenu: submenulist,
                    LinkwithForm: item.LinkwithForm,
                    Permission: formpermission === -1 ? [] : formList[formpermission].Roles
                };
                //   sunmenu.length = 0;
                //   submenulist.length = 0;
            }
        }
        console.log(menulist);
    }
    res.json(menulist);
    // table.aggregate([
    //     {
    //         $lookup: {
    //             from: "menus",
    //             localField: "_id",
    //             foreignField: "ParentId",
    //             as: "SubMenu"
    //         }
    //     },
    //     { $sort: { Order: 1 } },
    //     {
    //         "$match": {
    //             "ParentId": 0
    //         }
    //     }
    // ]).exec((err, pages) => {
    //     if (err) {
    //         res.send(err);
    //         return;
    //     }
    //     console.log(pages);
    //     res.json(pages);
    // });



};

exports.Findall = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Menu", menu.menuSchema);

    
    // table.find({ IsDeleted: false, Active: true })
    //     .select({
    //         _id: 1, MenuName: 1, ParentId: 1, "Modified": { "$slice": -1 },
    //         CreatedBy: 1, CreatedDate: 1
    //     })
    // table.aggregate([
    //     {
    //         $lookup: {
    //             from: "menus",
    //             localField: "_id",
    //             foreignField: "ParentId",
    //             as: "SubMenu"
    //         }
    //     },
    //     { $sort: { Order: 1 } },
    //     {
    //         "$match": {
    //             "ParentId": 0
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             CreatedBy: 1,
    //             CreatedDate:1,
    //             "MenuName": 1,
    //             "SubMenu": 1
    //         }
    //     }
    // ])
    await  table .aggregate([
        {
            "$match": {
                "ParentId": 0
            }
        },
        {
            "$unwind": {
                "path": "$_id",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$lookup": {
                "from": "menus",
                "localField": "_id",
                "foreignField": "ParentId",
                "as": "SubMenu"
            }
        },
        {
            "$unwind": {
                "path": "$SubMenu",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$unwind": {
                "path": "$SubMenu._id",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$lookup": {
                "from": "menus",
                "localField": "SubMenu._id",
                "foreignField": "ParentId",
                "as": "SubMenu.SubMenu"
            }
        },

        {
            "$unwind": {
                "path": "$SubMenu.SubMenu._id",
                "preserveNullAndEmptyArrays": true
            }
        },

        {
            "$group": {
                "_id": "$_id",
                'MenuName': { $first: '$MenuName' },
                'CreatedDate': { $first: '$CreatedDate' },
                'CreatedBy': { $first: '$CreatedBy' },
                "SubMenu": { "$push": "$SubMenu" }
            }

        }
    ])
        .exec()
        .then((pages) => {
            console.log(pages);
            res.json(pages);
        })
        .catch((err) => {
            res.send(err);
        });
};

exports.checkDuplication = async function (req, res) {
    var connection = databse.getDatabaseConnection(config.DefaultDatabse);
    var table = connection.model("Menu", menu.menuSchema);
    var id = req.params._id;
    var query = {};
    console.log(req.params);

    query['IsDeleted'] = false;
    query['Active'] = true;
    query['MenuName'] = new RegExp(`^${req.params.menuName}$`, 'i');
    if (id > 0) {
        console.log(id);
        query['_id'] = { $ne: Number(id) };
    }
    console.log(query);
    await table.findOne(query)
        .exec()
        .then((info) => {
            console.log(info);
            if (info) {
                res.json({ success: false, message: 'Menu Name is already taken' });
            } else {
                res.json({ success: true, message: 'Menu Name is available' });
            }
        })
        .catch((err) => {
            res.json({ success: false, message: err });
        });
};