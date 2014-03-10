// manages geolocation button on homepage
define(["jquery","app/location-manager"],
				function ($,location) {
	'use strict';

		// PUBLIC METHODS
		function init()
		{
			var openingScreen = document.getElementById("opening-screen");
			location.init(openingScreen);
		}

	return {
		init:init
	};
});