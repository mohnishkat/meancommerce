'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Meancommerce = new Module('meancommerce');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Meancommerce.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Meancommerce.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Meancommerce.menus.add({
    title: 'Categories',
    link: 'all categories',
    roles: ['admin'],
    menu: 'main'
  });
  Meancommerce.menus.add({
    title: 'Orders',
    link: 'all orders',
    roles: ['admin'],
    menu: 'main'
  });
  Meancommerce.menus.add({
    title: 'Products',
    link: 'all products',
    roles: ['admin'],
    menu: 'main'
  });

	Meancommerce.menus.add({
		title: 'Browse Categories',
		link: 'default category',
		menu: 'main'
	});

  Meancommerce.aggregateAsset('css', 'meancommerce.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Meancommerce.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Meancommerce.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Meancommerce.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Meancommerce;
});
