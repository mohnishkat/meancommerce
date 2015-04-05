'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema    = mongoose.Schema,
    crypto    = require('crypto'),
          _   = require('lodash');

var validateUniqueSlug = function(value, callback) {
  var Product = mongoose.model('Product');
  Product.find({
    $and: [{
      slug: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, product) {
    callback(err || product.length === 0);
  });
};

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    required: true,
    match: [/^[a-zA-Z0-9_-]+$/, 'The SKU must contain only letters, numbers, and underscores.'],
    validate: [validateUniqueSlug, 'SKU is already in-use']
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    match: [/^[a-zA-Z0-9_-]+$/, 'The Slug must contain only letters, numbers, and underscores.'],
    validate: [validateUniqueSlug, 'Slug is already in-use']
  },
  price: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
ProductSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');

ProductSchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

ProductSchema.path('slug').validate(function(slug) {
  return !!slug;
}, 'Slug cannot be blank');

/**
 * Statics
 */
ProductSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Product', ProductSchema);
