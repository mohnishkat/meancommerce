'use strict';

module.exports = function(Meancommerce, app, auth, database) {
  var checkout = require('../controllers/checkout');  
  app.route('/viewCart')
    .get(checkout.cartDetails);
};
