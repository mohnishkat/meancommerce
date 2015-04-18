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
  var categories = require('../controllers/categories');

  app.route('/admin/categories')
    .get(auth.requiresAdmin, categories.all)
    .post(auth.requiresAdmin, categories.create);
  app.route('/admin/categories/:categoryId')
    .get(auth.requiresAdmin, categories.show)
    .put(auth.requiresAdmin, auth.requiresAdmin, hasAuthorization, categories.update)
    .delete(auth.requiresAdmin, hasAuthorization, categories.destroy);  
  app.route('/categories')
    .get(categories.list)
  
  // Finish with setting up the categoryId param
  app.param('categoryId', categories.category);

};
