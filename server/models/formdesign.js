const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

const formdesignSchema = new Schema({
  _id: { type: Number, required: true },
  Columns: { type: Number, default: 0 },
  Title: { type: String, required: true, unique: true },
  Style: { type: String, default: "" },
  DesignContent: { type: String },
  FormContent: { type: String },
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
  formdesignSchema: formdesignSchema
}

module.exports = mongoose.model('FormDesign', formdesignSchema);

