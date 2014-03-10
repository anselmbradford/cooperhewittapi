// manages geolocation
define(function() {
  'use strict';

  var _city;
  var _region;

  var _temperature;

  var _windChill;
  var _windDirection;
  var _windSpeed;

	function init(json)
	{
		_city = json.query.results.channel.location.city;
		_region = json.query.results.channel.location.region;
		_temperature = json.query.results.channel.item.condition.temp;
		_windChill = json.query.results.channel.wind.chill;
		_windDirection = json.query.results.channel.wind.direction;
		_windSpeed = json.query.results.channel.wind.speed;
	}

	function getCity(){return _city;}
	function getRegion(){return _region;}
	function getTemperature(){return _temperature;}
	function getWindChill(){return _windChill;}
	function getWindDirection(){return _windDirection;}
	function getWindSpeed(){return _windSpeed;}

	return {
		init:init,
		getCity:getCity,
		getRegion:getRegion,
		getTemperature:getTemperature,
		getWindChill:getWindChill,
		getWindDirection:getWindDirection,
		getWindSpeed:getWindSpeed
	};
});