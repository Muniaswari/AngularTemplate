

'use strict';

var mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    email: { type: String },
    name: { type: String }
   // ,    _id: { type: String}
});
module.exports = {
  customerSchema  : customerSchema
}
module.exports = mongoose.model('customer', customerSchema);