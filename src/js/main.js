requirejs.config({
		baseUrl: 'js',
    paths: {
    		jquery: 'vendor/jquery-min',
        domReady: 'vendor/requirejs/domReady',
        async: 'vendor/requirejs/async'
    },
});

require(["app/screen-opening-manager"], function(screen1) {

	screen1.init();

});