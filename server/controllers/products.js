'use strict';

var mean = require('meanio');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  _ = require('lodash');


/**
 * Find Product by id
 */
exports.product = function(req, res, next, id) {
  Product.load(id, function(err, product) {
    if (err) return next(err);
    if (!product) return next(new Error('Failed to load Product ' + id));
    req.product = product;
    next();
  });
};

/**
 * Create an Product
 */
exports.create = function(req, res) {
  var product = new Product(req.body);
  product.user = req.user;
  product.save(function(err) {
  if (err) {
    switch (err.code) {
      default:
        var modelErrors = [];

        if (err.errors) {

          for (var x in err.errors) {
            modelErrors.push({
              param: x,
              msg: err.errors[x].message,
              value: err.errors[x].value
            });
          }

          res.status(400).json(modelErrors);
        }
    }

    return res.status(400);
  }
    res.json(product);

  });
};

/**
 * Update an Product
 */
exports.update = function(req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function(err) {
  if (err) {
    switch (err.code) {
      default:
        var modelErrors = [];

        if (err.errors) {

          for (var x in err.errors) {
            modelErrors.push({
              param: x,
              msg: err.errors[x].message,
              value: err.errors[x].value
            });
          }

          res.status(400).json(modelErrors);
        }
    }

    return res.status(400);
  }
    res.json(product);

  });
};

/**
 * Delete an Product
 */
exports.destroy = function(req, res) {
  var product = req.product;

  product.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the Product'
      });
    }
    res.json(product);

  });
};

/**
 * Show an Product
 */
exports.show = function(req, res) {
  res.json(req.product);
};

/**
 * List of Categories
 */
exports.all = function(req, res) {
  Product.find().sort('-created').populate('user', 'name username').exec(function(err, products) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the products'
      });
    }
    res.json(products);

  });
};
