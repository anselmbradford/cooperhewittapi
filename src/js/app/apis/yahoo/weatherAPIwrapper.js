// manages geolocation
define(function() {
  'use strict';

	var _callBack; // callback object to pass events to
	var _xmlhttp; // the XHR object to make calls with

	var _queryUrl; // base URL for the query

	function init()
	{
		_queryUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid=';

		// set up XHR
		if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  	_xmlhttp=new XMLHttpRequest();
	  }
		else
	  {// code for IE6, IE5
	  	_xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }

	  _xmlhttp.addEventListener("progress", _updateProgress, false);
		_xmlhttp.addEventListener("load", _transferComplete, false);
		_xmlhttp.addEventListener("error", _transferFailed, false);
		_xmlhttp.addEventListener("abort", _transferCanceled, false);

		return this;
	}

	function registerCallback(pCallBack)
	{
		_callBack = pCallBack;
		return this;
	}

	// ASYNC EVENT HANDLERS
	function _updateProgress(evt)
	{
    if (_callBack.progress)
			_callBack.progress(evt);
	}

	function _transferComplete(evt)
	{
		if (_callBack.load)
			_callBack.load(evt);
	}

	function _transferFailed(evt)
	{
		if (_callBack.error)
			_callBack.error(evt);
	}

	function _transferCanceled(evt)
	{
		if (_callBack.abort)
			_callBack.abort(evt);
	}

	function getWeather(woeid)
	{
		var queryUrl = _queryUrl+woeid+'&format=json';
		_xmlhttp.open("GET",queryUrl,true);
		_xmlhttp.send();
	}

	return {
		init:init,
		registerCallback:registerCallback,
		getWeather:getWeather
	};
});