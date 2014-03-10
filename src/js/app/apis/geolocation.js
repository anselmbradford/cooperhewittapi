// manages geolocation
define(function() {
  'use strict';

	// function to run on success or failure, new instance should be passed into geo.locate()
	var _callBack;

	var _position; // the location info

	function registerCallback(pCallBack)
	{
		if (!_callBack)
			_callBack = pCallBack;
	}

	function locate()
	{
		// modernizr should pick this up, but just in case...
		if (navigator.geolocation)
		{
			// Request a position whose age is not greater than 10 minutes old.
			navigator.geolocation.getCurrentPosition(_success,_error,{maximumAge:600000});
		}
		else{
			_callBack.error({message:"Geolocation is not supported."});
		}
	}

	function geocodeLocation(address)
	{
		var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      	var latlng = {'coords':{'latitude':results[0].geometry.location.d, 'longitude':results[0].geometry.location.e} };
      	_callBack.success(latlng,results[0].formatted_address);
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
	}

	// reverse geocode the location based on lat/long and place in address field
	function reverseGeocodeLocation(lat,lng)
	{
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(lat,lng);

		geocoder.geocode({'latLng': latlng}, function(results, status)
		{
			if (status == google.maps.GeocoderStatus.OK && results[0])
		  {
				var address = results[0].formatted_address;
				_callBack.success(_position,address);
		  }
		  else
		  {
				console.log("Geocoder failed due to: " + status);
				//alert.show("Your location could not be determined!");
		  }
		});
	}

	// location successfully found
	function _success(position)
	{
		reverseGeocodeLocation(position.coords.latitude,position.coords.longitude);
		_position = position;
	}

	// error retrieving location
	function _error(error)
	{
		switch(error.code)
		{
			case error.PERMISSION_DENIED:
				 error.message = "User denied the request for Geolocation.";
			break;
			case error.POSITION_UNAVAILABLE:
				error.message = "Location information is unavailable.";
			break;
			case error.TIMEOUT:
				error.message = "The request to get user location timed out.";
			break;
			case error.UNKNOWN_ERROR:
				error.message = "An unknown error occurred.";
			break;
		}

		_callBack.error(error);
	}

	return {
		registerCallback:registerCallback,
		locate:locate,
		geocodeLocation:geocodeLocation,
		reverseGeocodeLocation:reverseGeocodeLocation
	};
});