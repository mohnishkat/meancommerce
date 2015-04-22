'use strict';

var mean = require('meanio');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  _ = require('lodash');


/**
 * Find order by id
 */
exports.order = function(req, res, next, id) {
  Order.load(id, function(err, order) {
    if (err) return next(err);
    if (!order) return next(new Error('Failed to load order ' + id));
    req.order = order;
    next();
  });
};

/**
 * Create an order
 */
exports.create = function(req, res) {
  var order = new Order(req.body);
  order.user = req.user;
  order.save(function(err) {
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
    res.json(order);

  });
};

/**
 * Update an order
 */
exports.update = function(req, res) {
  var order = req.order;

  order = _.extend(order, req.body);

  order.save(function(err) {
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
    res.json(order);

  });
};

/**
 * Delete an order
 */
exports.destroy = function(req, res) {
  var order = req.order;

  order.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the order'
      });
    }
    res.json(order);

  });
};

/**
 * Show an order
 */
exports.show = function(req, res) {
  res.json(req.order);
};

/**
 * List of orders
 */
exports.all = function(req, res) {
  Order.find().sort('-created').populate('user', 'name username').exec(function(err, orders) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the orders'
      });
    }
    res.json(orders);

  });
};

/**
 * List of orders
 */
exports.list = function(req, res) {
  Order.find().sort('-created').exec(function(err, orders) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the orders'
      });
    }
    res.json(orders);

  });
};

