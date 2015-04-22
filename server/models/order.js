'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema    = mongoose.Schema,
    crypto    = require('crypto'),
          _   = require('lodash');


/**
 * Order Schema
 */
var OrderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  orderStatus: {
    type: String,
    required: true,
    trim: true
  },
  paymenetStatus: {
    type: String,
    required: true,
    trim: true
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true
  },
  comments: {
    type: String,
    required: true,
    trim: true
  },
  shippingMethod: {
    type: String,
    required: true,
    trim: true
  },
  total: {
    type: String,
    required: true,
    trim: true
  },
  shippingPrice: {
    type: String,
    required: true,
    trim: true
  },
  tax: {
    type: String,
    required: true,
    trim: true
  },
  grandTotal: {
    type: String,
    required: true,
    trim: true
  }
});


mongoose.model('Order', OrderSchema);

/**
 * Order products
 */
var OrderProductsSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Schema.ObjectId,
    ref: 'Order'
  },
  productId: {
    type: String,
    required: true,
    trim: true
  },
  productPrice: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    trim: true
  }
});


mongoose.model('OrderProducts', OrderProductsSchema);