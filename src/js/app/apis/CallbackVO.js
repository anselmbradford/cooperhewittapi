// manages geolocation button on homepage
define(function () {
	'use strict';

		// PUBLIC METHODS
		function progress(evt)
		{
			if (evt.lengthComputable)
			{
    		var percentComplete = evt.loaded / evt.total;
				console.log("loading...",percentComplete*100+"%");
			}
		}

		function load(evt)
		{
			var resp = JSON.parse(evt.target.response);
			console.log(resp);
		}

		function error(evt)
		{
			console.log("XHR Error: ",evt);
		}

		function abort(evt)
		{
			console.log("XHR Aborted: ",evt);
		}

	return function(){
		this.progress = progress;
		this.load = load;
		this.error = error;
		this.abort = abort;
		return this;
	};
});