// manages geolocation
define(function() {
	'use strict';

	var _callBack; // callback object to pass events to
	var _xmlhttp; // the XHR object to make calls with

	var _queryUrl; // base URL for the query

	var _accessToken; // access token

	var _page = 1; // page number

	function init()
	{
		_queryUrl = "http://coraldata.org/cooperhewittapi/chndm_proxy.php?method=";
		_accessToken = "ACCESS_TOKEN"; // placeholder for access token

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
	}

	function setPage(number)
	{
		_page = String(number);
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

	function _performQuery(query,params)
	{
		var paramStr = "";
		if (params)
		{
			for (var i in params)
			{
				if (params[i])
					paramStr += "&"+i+"="+encodeURIComponent(params[i]);
			}
		}
		var queryUrl = _queryUrl+query+"&access_token="+_accessToken+paramStr+"&page="+_page;

		// CORS
		if ("withCredentials" in _xmlhttp){
				_xmlhttp.open("GET", queryUrl, true);
		} else if (typeof XDomainRequest != "undefined"){ // IE
				_xmlhttp = new XDomainRequest();
				_xmlhttp.open("GET", queryUrl);
		} else {
				_xmlhttp = null;
		}

		_xmlhttp.send();
	}


	// PUBLIC METHODS
	function whatWouldMicahSay(){ _performQuery("cooperhewitt.labs.whatWouldMicahSay"); }
	function methods(){ _performQuery("api.spec.methods"); }
	function formats(){ _performQuery("api.spec.formats"); }
	function echo(){ _performQuery("api.test.echo"); }
	function error(){ _performQuery("api.test.error"); }

	function departmentsGetInfo(id){ _performQuery("cooperhewitt.departments.getInfo",{"id":id}); }
	function departmentsGetList(){ _performQuery("cooperhewitt.departments.getList"); }

	function exhibitionsGetInfo(id){ _performQuery("cooperhewitt.exhibitions.getInfo",{"id":id}); }
	function exhibitionsGetList(){ _performQuery("cooperhewitt.exhibitions.getList"); }

	function galleriesIsOpen(){ _performQuery("cooperhewitt.galleries.isOpen"); }

	function objectsGetAlbers(id){ _performQuery("cooperhewitt.objects.getAlbers",{"id":id}); }
	function objectsGetColors(id){ _performQuery("cooperhewitt.objects.getColors",{"id":id}); }
	function objectsGetEpitaph(id){ _performQuery("cooperhewitt.objects.getEpitaph",{"id":id}); }
	function objectsGetExhibitions(id){ _performQuery("cooperhewitt.objects.getExhibitions",{"id":id}); }
	function objectsGetImages(id){ _performQuery("cooperhewitt.objects.getImages",{"id":id}); }
	function objectsGetInfo(id,accession_number,extras){
		console.log("NOTE: You MUST pass either a valid object ID or accession number. Object IDs take precedence.");
		_performQuery("cooperhewitt.objects.getInfo",{"id":id,"accession_number":accession_number,"extras":extras});
	}
	function objectsGetParticipants(id){ _performQuery("cooperhewitt.objects.getParticipants",{"id":id}); }
	function objectsGetRandom(){ _performQuery("cooperhewitt.objects.getRandom"); }

	function peopleGetInfo(id){ _performQuery("cooperhewitt.people.getInfo",{"id":id}); }

	function periodsGetInfo(id){ _performQuery("cooperhewitt.periods.getInfo",{"id":id}); }
	function periodsGetList(){ _performQuery("cooperhewitt.periods.getList"); }

	function rolesGetInfo(id){ _performQuery("cooperhewitt.roles.getInfo",{"id":id}); }
	function rolesGetList(){ _performQuery("cooperhewitt.roles.getList"); }

	function searchCollection(){ _performQuery("cooperhewitt.search.collection",{"id":id}); }

	function searchObjects(obj){
		_performQuery("cooperhewitt.search.objects",{
		"accession_number": (obj.a || obj.accession_number),
		"color": (obj.c || obj.color),
		"department_id": (obj.D || obj.department_id),
		"description": (obj.d || obj.description),
		"exhibition": (obj.e || obj.exhibition),
		"exhibition_id": (obj.E || obj.exhibition_id),
		"has_images": (obj.i || obj.has_images),
		"justification": (obj.j || obj.justification),
		"location": (obj.l || obj.location),
		"medium": (obj.m || obj.medium),
		"medium_id": (obj.M || obj.medium_id),
		"period": (obj.pr || obj.period),
		"period_id": (obj.PR || obj.period_id),
		"person": (obj.p || obj.person),
		"person_id": (obj.P || obj.person_id),
		"query": (obj.q || obj.query),
		"role": (obj.r || obj.role),
		"role_id": (obj.R || obj.role_id),
		"title": (obj.t || obj.title),
		"type": (obj.ty || obj.type),
		"type_id": (obj.TY || obj.type_id),
		"woe_id": (obj.W || obj.woe_id),
		"year_acquired": (obj.y || obj.year_acquired),
		"year_end": (obj.ye || obj.year_end),
		"year_start": (obj.ys || obj.year_start)
	}); }

	function searchObjectsFaceted(obj){
		_performQuery("cooperhewitt.search.objectsFaceted",{
		"accession_number": (obj.a || obj.accession_number),
		"color": (obj.c || obj.color),
		"department_id": (obj.D || obj.department_id),
		"description": (obj.d || obj.description),
		"exhibition": (obj.e || obj.exhibition),
		"exhibition_id": (obj.E || obj.exhibition_id),
		"has_images": (obj.i || obj.has_images),
		"justification": (obj.j || obj.justification),
		"location": (obj.l || obj.location),
		"medium": (obj.m || obj.medium),
		"medium_id": (obj.M || obj.medium_id),
		"period": (obj.pr || obj.period),
		"period_id": (obj.PR || obj.period_id),
		"person": (obj.p || obj.person),
		"person_id": (obj.P || obj.person_id),
		"query": (obj.q || obj.query),
		"role": (obj.r || obj.role),
		"role_id": (obj.R || obj.role_id),
		"title": (obj.t || obj.title),
		"type": (obj.ty || obj.type),
		"type_id": (obj.TY || obj.type_id),
		"woe_id": (obj.W || obj.woe_id),
		"year_acquired": (obj.y || obj.year_acquired),
		"year_end": (obj.ye || obj.year_end),
		"year_start": (obj.ys || obj.year_start),
		"facet": obj.facet
	}); }

	function typesGetInfo(id){ _performQuery("cooperhewitt.types.getInfo",{"id":id}); }
	function typesGetList(){ _performQuery("cooperhewitt.types.getList"); }


	return {
		init:init,
		registerCallback:registerCallback,
		setPage:setPage,
		whatWouldMicahSay:whatWouldMicahSay,
		methods:methods,
		formats:formats,
		echo:echo,
		error:error,
		departmentsGetInfo:departmentsGetInfo,
		departmentsGetList:departmentsGetList,
		exhibitionsGetInfo:exhibitionsGetInfo,
		exhibitionsGetList:exhibitionsGetList,
		galleriesIsOpen:galleriesIsOpen,
		objectsGetAlbers:objectsGetAlbers,
		objectsGetColors:objectsGetColors,
		objectsGetEpitaph:objectsGetEpitaph,
		objectsGetExhibitions:objectsGetExhibitions,
		objectsGetImages:objectsGetImages,
		objectsGetInfo:objectsGetInfo,
		objectsGetParticipants:objectsGetParticipants,
		objectsGetRandom:objectsGetRandom,
		peopleGetInfo:peopleGetInfo,
		periodsGetList:periodsGetList,
		rolesGetInfo:rolesGetInfo,
		rolesGetList:rolesGetList,
		searchCollection:searchCollection,
		searchObjects:searchObjects,
		searchObjectsFaceted:searchObjectsFaceted,
		typesGetInfo:typesGetInfo,
		typesGetList:typesGetList
	};
});