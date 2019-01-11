

'use strict';

var mongoose = require('mongoose');

var Modified = new mongoose.Schema({
    ModifiedBy: [{ type: String }],
    ModifiedDate: { type: Date, default: Date.now },
});