'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
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
};
