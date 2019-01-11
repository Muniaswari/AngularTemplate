
'use strict';

var mongoose = require('mongoose');
var modifieduser = require('./../models/common');
mongoose.Promise = global.Promise; // Configure Mongoose Promises
var menuSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  MenuName: { type: String, unique: true },
  RouteUrl: { type: String, select: false },
  ParentId: { type: Number },
  LinkwithForm:{type:Number,default:0},
  Icon: String,
  Order: Number,
  CreatedBy: { type: String, default: "" },
  CreatedDate: { type: Date, required: true, default: Date.now },
  Modified: [{
    ModifiedBy: { type: String },
    ModifiedDate: { type: Date, default: Date.now }
  }],
  DeletedBy: { type: String, default: "" },
  DeletedDate: { type: Date, default: Date.now },
  IsDeleted: { default: false, required: true, type: Boolean },
  Active: { default: true, required: true, type: Boolean }
});

module.exports = {
  menuSchema: menuSchema
}
module.exports = mongoose.model('Menu', menuSchema);