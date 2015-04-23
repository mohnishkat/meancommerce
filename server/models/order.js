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
  order_status: {
    type: String,
    required: true,
    trim: true
  },
  paymenet_status: {
    type: String,
    required: true,
    trim: true
  },
  payment_method: {
    type: String,
    required: true,
    trim: true
  },
  comments: {
    type: String,
    trim: true
  },
  shipping_method: {
    type: String,
    required: true,
    trim: true
  },
  total: {
    type: String,
    required: true,
    trim: true
  },
  shipping_price: {
    type: String,
    required: true,
    trim: true
  },
  tax: {
    type: String,
    required: true,
    trim: true
  },
  grand_total: {
    type: String,
    required: true,
    trim: true
  },
  product_info: [{
    id : String,
    price : Number,
    quantity: Number
  }]
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