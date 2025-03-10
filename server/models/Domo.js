const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    required: true,
    min: 0,
  },

  height: {
    type: Number,
    required: true,
    min: 0,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age height').exec(callback);
};

DomoSchema.statics.removeByAttr = (attr, callback) => {
  return DomoModel.deleteOne(attr, (err) => {
    if (err) console.log(err);
    console.log('1 document(s) deleted');
  }, callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = {
  DomoModel,
  DomoSchema,
};
