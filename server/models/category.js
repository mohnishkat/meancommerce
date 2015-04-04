'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema    = mongoose.Schema,
    crypto    = require('crypto'),
          _   = require('lodash');

var validateUniqueSlug = function(value, callback) {
  var Category = mongoose.model('Category');
  Category.find({
    $and: [{
      slug: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, category) {
    callback(err || category.length === 0);
  });
};

/**
 * Category Schema
 */
var CategorySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    match: [/^[a-zA-Z0-9]+$/, 'The Slug must contain only letters, numbers, and underscores.'],
    validate: [validateUniqueSlug, 'Slug is already in-use']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
CategorySchema.path('title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

CategorySchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

CategorySchema.path('slug').validate(function(slug) {
  return !!slug;
}, 'Slug cannot be blank');

/**
 * Statics
 */
CategorySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Category', CategorySchema);
