'use strict';

var mean = require('meanio');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  _ = require('lodash');

/**
 * cart count
 */
exports.cartDetails = function(req, res) {
	if(typeof req.session.cart != "undefined"){
		res.json({cartDetails:req.session.cart});
	}else{
		res.json({cartDetails:"null"});
	}
};
