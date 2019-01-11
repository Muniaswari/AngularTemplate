

'use strict';

var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  rolename: { type: String, required: true, unique: true },
  roleparentid: { type: Number },
  description: { type: String },
  Users: [{ type: String, required: true }],
  CreatedBy: { type: String, required: true },
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
  roleSchema: roleSchema
}
module.exports = mongoose.model('UserRole', roleSchema);