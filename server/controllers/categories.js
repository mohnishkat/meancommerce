'use strict';

var mean = require('meanio');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Category = mongoose.model('Category'),
  _ = require('lodash');


/**
 * Find category by id
 */
exports.category = function(req, res, next, id) {
  Category.load(id, function(err, category) {
    if (err) return next(err);
    if (!category) return next(new Error('Failed to load category ' + id));
    req.category = category;
    next();
  });
};

/**
 * Create an category
 */
exports.create = function(req, res) {
  var category = new Category(req.body);
  category.user = req.user;
  category.save(function(err) {
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
    res.json(category);

  });
};

/**
 * Update an category
 */
exports.update = function(req, res) {
  var category = req.category;

  category = _.extend(category, req.body);

  category.save(function(err) {
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
    res.json(category);

  });
};

/**
 * Delete an category
 */
exports.destroy = function(req, res) {
  var category = req.category;

  category.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the category'
      });
    }
    res.json(category);

  });
};

/**
 * Show an category
 */
exports.show = function(req, res) {
  res.json(req.category);
};

/**
 * List of Categories
 */
exports.all = function(req, res) {
  Category.find().sort('-created').populate('user', 'name username').exec(function(err, categories) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the categories'
      });
    }
    res.json(categories);

  });
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
  Category.find().sort('-created').exec(function(err, categories) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the categories'
      });
    }
    res.json(categories);

  });
};

