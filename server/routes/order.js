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
  var orders = require('../controllers/orders');

  app.route('/admin/orders')
    .get(auth.requiresAdmin, orders.all)
    .post(auth.requiresAdmin, orders.create);
  app.route('/admin/orders/:orderId')
    .get(auth.requiresAdmin, orders.show)
    .put(auth.requiresAdmin, auth.requiresAdmin, hasAuthorization, orders.update)
    .delete(auth.requiresAdmin, hasAuthorization, orders.destroy);  
  app.route('/orders')
    .get(orders.list)
  
  // Finish with setting up the orderId param
  app.param('orderId', orders.order);

};
