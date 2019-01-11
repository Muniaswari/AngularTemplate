
'use strict';

var bcrypt = require('bcryptjs');
var mongoose = require('mongoose'); 
var modifieduser = require('./../models/common');
mongoose.Promise = global.Promise; // Configure Mongoose Promises

var userSchema = new mongoose.Schema({
  email: { type: String, lowercase: true },
  password: { type: String, select: false },
  picture: String,
  provider: String,
  provider_id: String,
  CompanyName: { type: String, default: "" },
  ContactNo: { type: String, default: "" },
  Country: { type: String, default: "" },
  CreatedBy: { type: String,default:"" },
  CreatedDate: { type: Date, required: true, default: Date.now },
  Modified: [modifieduser],
  DeletedBy: { type: String, default: "" },
  DeletedDate: { type: Date, default: Date.now },
  IsDeleted: { default: false, required: true, type: Boolean },
  Active: { default: true, required: true, type: Boolean },
  IsAdmin: { default: false, required: true, type: Boolean }
});

userSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};
module.exports = {
userSchema  : userSchema
}
//var User = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);