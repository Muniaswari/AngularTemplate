/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
var modifieduser = require('./../models/common');

var Roles = new mongoose.Schema({
  RoleId: { type: Number },
  FormPermissions: {
    Add: { default: false, type: Boolean },
    Edit: { default: false, required: true, type: Boolean },
    Delete: { default: false, required: true, type: Boolean },
    View: { default: false, required: true, type: Boolean },
    Report: { default: false, required: true, type: Boolean }, default: {}
  }
});
// User Model Definition
const masterdataSchema = new Schema({
  _id: { type: Number, required: true,unique:false },
  Category: { type: Number, default: 0 },
  FormName: { type: String, required: true, unique: false },
  RouteUrl: { type: String, default: "" },
  Description: { type: String },
  Roles: [Roles],
  FormDesignId:[{type:Number}],
  CreatedBy: { type: String, required: true },
  CreatedDate: { type: Date, required: true, default: Date.now },
  Modified: [{
    ModifiedBy: { type: String },
    ModifiedDate: { type: Date, default: Date.now }
  }],
  DeletedBy: { type: String, default: "" },
  DeletedDate: { type: Date, default: Date.now },
  IsDeleted: { default: false, required: true, type: Boolean },
  Active: { default: true, required: true, type: Boolean },

  IsForm: { required: true, default: 0, type: Boolean },
  IsData: { required: true, default: 0, type: Boolean }
});
module.exports = {
  masterdataSchema: masterdataSchema
}
// Export Module/Schema
module.exports = mongoose.model('Master', masterdataSchema);
