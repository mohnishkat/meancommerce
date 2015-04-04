'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.category.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Meancommerce, app, auth, database) {

  app.get('/meancommerce/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/meancommerce/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/meancommerce/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/meancommerce/example/render', function(req, res, next) {
    Meancommerce.render('index', {
      package: 'meancommerce'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });

  var categories = require('../controllers/categories');
  app.route('/admin/categories')
    .get(auth.requiresAdmin, categories.all)
    .post(auth.requiresAdmin, categories.create);
  app.route('/admin/categories/:categoryId')
    .get(auth.requiresAdmin, categories.show)
    .put(auth.requiresAdmin, auth.requiresAdmin, hasAuthorization, categories.update)
    .delete(auth.requiresAdmin, hasAuthorization, categories.destroy);

  // Finish with setting up the categoryId param
  app.param('categoryId', categories.category);
};
