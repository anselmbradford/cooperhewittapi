module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-compass')
	grunt.loadNpmTasks('grunt-contrib-copy')

	grunt.initConfig({
		requirejs: {
	    options: {
		    baseUrl: 'src/js',
		    mainConfigFile: 'src/js/vendor/requireconfig.js',
		    name: 'vendor/almond',
		    include: ['main']
		  },
		  production: {
		    // overwrites the default config above
		    options: {
		      out: 'www/js/main.js'
		    } //options
		  }, //production
		  development: {
		    // overwrites the default config above
		    options: {
		      out: 'www/js/main.js',
		      optimize: 'none' // no minification
		    } //options
		  } //development
		}, //requirejs
		compass: {
			dev: {
				options: {
					config: 'config.rb'
				} //options
			} //dev
		}, //compass
		copy: {
		  main: {
		    files: [
		      // copy root files
		      {expand: true, flatten: true, src: ['src/*'], dest: 'www/', filter: 'isFile'},

		      // copy img directory
		      {expand: true, cwd: 'src/', src: ['img/**'], dest: 'www/'},

		      // copy css directory
		      {expand: true, cwd: 'src/', src: ['css/*'], dest: 'www/'},

		      // copy helper.js
		      {expand: true, cwd: 'src/', src: ['js/helper.js'], dest: 'www/'},

		      // copy requirejs
		      {expand: true, cwd: 'src/', src: ['js/vendor/require.js'], dest: 'www/'},

					// copy modernizr
		      {expand: true, cwd: 'src/', src: ['js/vendor/modernizr-2.6.2.min.js'], dest: 'www/'},

					// copy zepto
		      {expand: true, cwd: 'src/', src: ['js/vendor/zepto.min.js'], dest: 'www/'}

		    ] //files
		  } //main
		}, //copy
		watch: {
			scripts: {
				files: ['src/js/app/**/*.js'],
			}, //scripts
			sass: {
				files: ['src/sass/*.scss'],
				tasks: ['compass:dev']
			}, //sass
			html: {
				files: ['*.html']
			} //html
		} //watch
	}) //initConfig
	grunt.registerTask('default', 'watch');
	grunt.registerTask('production', ['requirejs:production','compass:dev','copy']);
	grunt.registerTask('development', ['requirejs:development','compass:dev','copy']);
} //exports