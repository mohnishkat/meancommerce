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

  var products = require('../controllers/products');
  app.route('/admin/products')
    .get(auth.requiresAdmin, products.all)
    .post(auth.requiresAdmin, products.create);
  app.route('/admin/products/:productId')
    .get(auth.requiresAdmin, products.show)
    .put(auth.requiresAdmin, auth.requiresAdmin, hasAuthorization, products.update)
    .delete(auth.requiresAdmin, hasAuthorization, products.destroy);
  app.route('/category/products/:categoryId')
    .get(products.productByCategory);
  app.route('/products/userCart')
    .post(products.userCart);
  app.route('/products/userCartCount')
    .get(products.userCartCount);
  // Finish with setting up the categoryId param
  app.param('productId', products.product);

};
