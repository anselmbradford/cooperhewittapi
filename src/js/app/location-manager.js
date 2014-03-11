// manages geolocation button on homepage
define(['jquery',
				'app/apis/yahoo/weatherVO',
				'app/apis/CallbackVO',
				'app/apis/cooperhewitt/chAPIwrapper',
				'app/apis/yahoo/placesAPIwrapper',
				'app/apis/yahoo/weatherAPIwrapper',
				'app/apis/geolocation',
				'async!https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false!callback',
				'domReady!'],
				function ($,weatherVO,CallbackVO,chndm,places,weather,geo) {
	'use strict';

		// PRIVATE PROPERTIES
		var _locationCntr; // the location container
		var _imageCntr; // the content container
		var _saveBtn; // the save location button
		var _locateBtn; // locate current location button
		var _posterBtn; // button to show the poster
		var _closeBtn; // close the poster button
		var _locationInput; // input field that contains location value
		var _posterUrl; // URL of poster image

		var _destinations = [
						{ 'name':'IRELAND', 'lat':'53.412910', 'lng':'-8.243890' },
						{ 'name':'NEW YORK', 'lat':'40.714353', 'lng':'-74.005973' },
						{ 'name':'NEW ENGLAND', 'lat':'43.965389', 'lng':'-70.822654' },
						{ 'name':'WASHINGTON', 'lat':'38.907231', 'lng':'-77.036464' },
						{ 'name':'ROME', 'lat':'41.892916', 'lng':'12.482520' },
						{ 'name':'EUROPE', 'lat':'54.525961', 'lng':'15.255119' },
						{ 'name':'HOLLAND', 'lat':'52.132633', 'lng':'5.291266' },
						{ 'name':'SWEDEN', 'lat':'60.128161', 'lng':'18.643501' },
						{ 'name':'ENGLAND', 'lat':'52.355518', 'lng':'-1.174320' },
						{ 'name':'MEXICO', 'lat':'23.634501', 'lng':'-102.552784' },
						{ 'name':'PARIS', 'lat':'48.856614', 'lng':'2.352222' },
						{ 'name':'EAST COAST', 'lat':'42.358431', 'lng':'-71.059773' },
						{ 'name':'CHICAGO', 'lat':'41.878114', 'lng':'-87.629798' },
						{ 'name':'SCANDINAVIA', 'lat':'62.278648', 'lng':'12.340171' },
						{ 'name':'NEW MEXICO', 'lat':'34.519940', 'lng':'-105.870090' },
						{ 'name':'CALIFORNIA', 'lat':'36.778261', 'lng':'-119.417932' }
					];

		var _generalDestinations = [
						{'name':'black sphere'},
						{'name':'WINTER SPORTS'},
						{'name':'abstract man wearing'},
						{'name':'abstract man wearing'}
					];

		var _NE=[],
				_SE=[],
				_SW=[],
				_NW=[];

		var _quadrant;
		var _windDirection;
		var _windSpeed;

		// PUBLIC METHODS
		function init()
		{
			_saveBtn = document.getElementById('save-btn');
			_locationCntr = document.getElementById('location-container');
			_posterBtn = document.getElementById('poster-button');
			_closeBtn = document.getElementById('close-btn');
			_imageCntr = document.getElementById('image-container');

			_saveBtn.addEventListener('click',_handleSaveClick,false);
			_posterBtn.addEventListener('click',_handlePosterClick,false);
			_closeBtn.addEventListener('click',_handlerClosePosterClick,false);

			if (navigator.geolocation) // if geolocation is supported, show geolocate button
			{
				_locateBtn = document.getElementById('locate-btn');
				_locateBtn.addEventListener( "click" , _handleLocateClicked, false );
				_locationInput = document.getElementById('location');

				// For cross-browser purposes, use jQuery to handle return key press.
				$(_locationInput).keypress(function(e) {
				    if (e.which == "13") {
				        _handleSaveClick();
				    }
				});

				_locateBtn.classList.remove('hide');
			}

			// callback object to hand off to geo locator object
			var geoCallBack = {
				success:function(position,address)
				{
					_calcBearings(position.coords.latitude,position.coords.longitude);

					_lookupWeather(position.coords.latitude,position.coords.longitude);

					_locationInput.value = address;
				}
				,
				error:function(error)
				{
					//console.log("Geolocation failed due to: " + error.message);
					alert.show("Your location could not be determined!");
				}
			}

			geo.registerCallback(geoCallBack);
		}

		function _showLoading()
		{
			$("#loading-icon").animate({
			    opacity: "1",
			  }, 500);
		}

		function _hideLoading()
		{
			$("#loading-icon").animate({
			    opacity: "0",
			  }, 500);
		}

		// Calculate bearings for list of destinations relative to latitude/longitude position.
		function _calcBearings(lat,lng)
		{
			var brng;
			var quadrant;

			// resets quadrant arrays
			_NE=[],
			_SE=[],
			_SW=[],
			_NW=[];

			for( var d in _destinations )
			{
				brng = _calcRhumblines(lat,lng,_destinations[d]['lat'],_destinations[d]['lng']);
				if (brng > 0 && brng < 90)
					_NE.push(_destinations[d]);
				else if (brng >= 90 && brng < 180)
					_SE.push(_destinations[d]);
				else if (brng >= 180 && brng < 270)
					_SW.push(_destinations[d]);
				else if (brng >= 270 && brng <= 360)
					_NW.push(_destinations[d]);
			}
		}

		// Calculate furthest destination.
		function _findFurthestDestination(lat1,lng1)
		{
			var furthest = 0;
			var item;

			lat1 = (lat1 * (Math.PI/180));
			lng1 = (lng1 * (Math.PI/180));

			var quadrant;
			if (_windDirection > 0 && _windDirection < 90)
				quadrant = _NE;
			else if (_windDirection >= 90 && _windDirection < 180)
				quadrant = _SE;
			else if (_windDirection >= 180 && _windDirection < 270)
				quadrant = _SW;
			else if (_windDirection >= 270 && _windDirection <= 360)
				quadrant = _NW;

			for( var d in quadrant )
			{
				var lat2 = quadrant[d]['lat'] * (Math.PI/180);
				var lng2 = quadrant[d]['lng'] * (Math.PI/180);

				var R = 6371; // km
				var dist = Math.acos(Math.sin(lat1)*Math.sin(lat2) +
                  Math.cos(lat1)*Math.cos(lat2) *
                  Math.cos(lng2-lng1)) * R;

				if (dist >= furthest)
				{
					item = quadrant[d];
					furthest = dist;
				}
			}

			return item;
		}

		// Calculates Rhumb lines for determining constant bearing between two points
		function _calcRhumblines(lat1,lng1,lat2,lng2)
		{
			var R = 6371; // km

			lat1 = (lat1 * (Math.PI/180));
			lng1 = (lng1 * (Math.PI/180));
			lat2 = (lat2 * (Math.PI/180))
			lng2 = (lng2 * (Math.PI/180));

			var dLat = lat2-lat1;
			var dLon = lng2-lng1;


			var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));

			var q = dLat/dPhi;
			if (!isFinite(q)) q = Math.cos( lat1 );
			// if dLon over 180° take shorter rhumb across 180° meridian:
			if (Math.abs(dLon) > Math.PI) {
			  dLon = dLon>0 ? -(2*Math.PI-dLon) : (2*Math.PI+dLon);
			}
			var d = Math.sqrt(dLat*dLat + q*q*dLon*dLon) * R;

			var brng =  Math.atan2(dLon, dPhi);
			brng = brng*(180/Math.PI); // brng in degrees
			brng = (brng+360)%360; // normalize

			return brng;
		}

		function _handleSaveClick(evt)
		{
			    _showLoading();
			$("#opening-screen").animate({
			    left: "-200%",
			  }, 1000, function() {
			    // Animation complete.
			  });

			//_weatherScreen.classList.add("slide-left-in");
			geo.geocodeLocation(_locationInput.value);
		}

		function _handlePosterClick(evt)
		{
			//document.getElementById("image-container").style.backgroundImage = "url("+_posterUrl+")";
			$("#poster-screen").animate({
			    left: "0",
			  }, 1000);
		}

		function _handlerClosePosterClick(evt)
		{
			$("#poster-screen").animate({
			    left: "200%",
			  }, 1000);
		}

		// 'use current location' link clicked
		function _handleLocateClicked(evt)
		{
			evt.preventDefault();
			_locateUser();
			return false;
		}

		// use geolocation to locate the user
		function _locateUser()
		{
			geo.locate();
		}

		function _lookupWeather(lat,lng)
		{

			var placeCallback = new CallbackVO();
				placeCallback.load = function(evt)
				{
					weather.getWeather(places.extractWoeID(evt.target.response));
				}

			var weatherCallback = new CallbackVO();
				weatherCallback.load = function(evt)
				{
					weatherVO.init( JSON.parse(evt.target.response) );

					_windDirection = weatherVO.getWindDirection();
					_windSpeed = weatherVO.getWindSpeed();

					_windDirection = weatherVO.getWindDirection();
					var quadrant;
					if (_windDirection >= 0 && _windDirection < 90)
					{
						quadrant = _NE;
						_quadrant = "NE";
					}
					else if (_windDirection >= 90 && _windDirection < 180)
					{
						quadrant = _SE;
						_quadrant = "SE";
					}
					else if (_windDirection >= 180 && _windDirection < 270)
					{
						quadrant = _SW;
						_quadrant = "SW";
					}
					else if (_windDirection >= 270 && _windDirection <= 360)
					{
						quadrant = _NW;
						_quadrant = "NW";
					}

					if (_windDirection == 0) _quadrant = "N";
					else if (_windDirection == 90) _quadrant = "E";
					else if (_windDirection == 180) _quadrant = "S";
					else if (_windDirection == 270) _quadrant = "W";

					if (quadrant.length == 0)
					{
						if (_quadrant == "W" || _quadrant == "NW")
						{
							quadrant.push(_generalDestinations[0]);
						}
						else if (_quadrant == "N" || _quadrant == "NE")
						{
							quadrant.push(_generalDestinations[1]);
						}
						else if (_quadrant == "E" || _quadrant == "SE")
						{
							quadrant.push(_generalDestinations[2]);
						}
						else if (_quadrant == "S" || _quadrant == "SW")
						{
							quadrant.push(_generalDestinations[3]);
						}
					}
					var item = quadrant[Math.floor(Math.random()*quadrant.length)];

					_setWindConditionsDisplay();
					_lookupCooperHewitt(item);
				}

			places.init().registerCallback(placeCallback); // initialize places search
			weather.init().registerCallback(weatherCallback); // initalize weather search

			places.getPlaceInfo(lat,lng);
		}

		function _setWindConditionsDisplay()
		{
			 _hideLoading();

			$("#weather-screen").animate({
			    left: "0",
			  }, 1000, function() {
			    // Animation complete.
			    $("#poster-button").animate({
			    opacity: "1",
				  }, 500);
			  });

			$("#plane-icon").animate(
				{  outlineWidth: (_windDirection-45) },
				{
			    step: function(now,fx) {
			      $(this).css({transform:'rotate('+now+'deg)'});
			    },
			    duration:'slow'
				},'swing');

			//.style.webkitTransform = "rotate("+(Number(_windDirection)-45)+"deg)";
			document.getElementById("wind-direction-speed").innerHTML = _windSpeed+"mph";
			document.getElementById("wind-direction-quadrant").innerHTML = _quadrant;
		}

		function _lookupCooperHewitt(item)
		{
			var callback = new CallbackVO();
			callback.load = function(evt)
			{
				var json = JSON.parse(evt.target.response);

				var src = json.objects[Math.floor(Math.random()*json.objects.length)].images[0];
				if (src)
				{
					_posterUrl = src.z.url
					document.getElementById("image-container").style.backgroundImage = "url("+_posterUrl+")";
				}
			}

			chndm.init().registerCallback(callback);
			chndm.searchObjects({"type":"posters","title":"American+Airlines","description":item['name'].replace(new RegExp(" ", 'g'), "+"),"i":"true"});
		}

	return {
		init:init
	};
});