var maplat = 51.43245,
	maplon = 0.688333333,
	my_lat = 51.3327,
	my_lon = 0.4439,
	map, gmarkers,
	icon,
	counter, maxrange = 0,

mapicon = function(image, i)
{
	if(i === 1)
	{
		return {
			url: image,
			anchor: new google.maps.Point(2, 4),
			origin: new google.maps.Point(0, 0),
			size: new google.maps.Size(4, 4)
		};
	}
	if(i === 2){
		return {
			url: image,
			anchor: new google.maps.Point(10, 34),
			origin: new google.maps.Point(0, 0),
			size: new google.maps.Size(20, 34)
		};
	}
	return {
		url: image,
		anchor: new google.maps.Point(6, 20),
		origin: new google.maps.Point(0, 0),
		size: new google.maps.Size(12, 20)
	};
},
createMarker = function(map, point, name, html, iconz)
{
	var marker = new google.maps.Marker({map: map, position: point, icon: iconz});
	return marker;
},
doUpdate = function()
{
	var xmlmarker = document.getElementsByClassName("marker"),
		lat, lon, type, icon, i, point,
		currentTime = new Date();
	
	if(!gmarkers){gmarkers = [];}
	
	for(i = 0; i < xmlmarker.length; i += 1)
	{
		lat = parseFloat(xmlmarker[i].getAttribute("lat"));
		lon = parseFloat(xmlmarker[i].getAttribute("lon"));
		type = parseInt(xmlmarker[i].getAttribute("type"), 10);
		icon = lbjs.ais.getColour(type);
		if(gmarkers[i])
		{
			google.maps.event.clearListeners(gmarkers[i], "click");
			google.maps.event.clearListeners(gmarkers[i], "mouseover");
			google.maps.event.clearListeners(gmarkers[i], "mouseout");
			gmarkers[i].setMap(null);
		}
		point = new google.maps.LatLng(lat, lon);
		gmarkers[i] = createMarker(map, point, name, null, icon);
	}
	
	maxrange = 0;
};

lbjs(document).ready(function(){
	var mapElem = lbjs(document.getElementById("map"));
	map = new google.maps.Map(mapElem[0], {
		scrollwheel: false,
		zoom: 11, 
		center: {lat: maplat, lng: maplon},
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_TOP
		},
		streetViewControl: true,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.RIGHT_TOP
		}
	});
	mapElem.height(parseInt(window.innerHeight - 35, 10));
	
	lbjs.ais.icons.home = mapicon("http://static.lukebridges.co.uk/medwayais/marker.png", 2);
	createMarker(map, new google.maps.LatLng(my_lat, my_lon), 'Receiving Point', null, lbjs.ais.icons.home);

	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('keyTable'));

	tooltip = document.createElement("div");
	tooltip.style.visibility = "hidden";

	lbjs.ais.icons.k = mapicon("http://medwayais.co.uk/icons/mm_20_gray.png", 0);
	lbjs.ais.icons.b = mapicon("http://medwayais.co.uk/icons/mm_20_blue.png", 0);
	lbjs.ais.icons.a = mapicon("http://medwayais.co.uk/icons/mm_20_red.png", 0);
	lbjs.ais.icons.g = mapicon("http://medwayais.co.uk/icons/lifebot.png", 0);
	lbjs.ais.icons.hs = mapicon("http://medwayais.co.uk/icons/hispdcrft.png", 0);
	lbjs.ais.icons.dr = mapicon("http://medwayais.co.uk/icons/mm_20_green.png", 0);
	lbjs.ais.icons.r = mapicon("http://medwayais.co.uk/icons/mm_20_yellow.png", 0);
	lbjs.ais.icons.w = mapicon("http://medwayais.co.uk/icons/mm_20_white.png", 0);
	lbjs.ais.icons.y = mapicon("http://medwayais.co.uk/icons/mm_20_brown.png", 0);
	lbjs.ais.icons.m = mapicon("http://medwayais.co.uk/icons/mm_20_black.png", 0);
	lbjs.ais.icons.o = mapicon("http://medwayais.co.uk/icons/mm_20_purple.png", 0);
	lbjs.ais.icons.n = mapicon("http://medwayais.co.uk/icons/mm_20_brown.png", 0);
	lbjs.ais.icons.track = mapicon("http://medwayais.co.uk/icons/shiptrkicon.gif", 1);
	
	lbjs.ais.iconLookup = {30: lbjs.ais.icons.y, 31: lbjs.ais.icons.o, 32: lbjs.ais.icons.o, 33: lbjs.ais.icons.dr, 34: lbjs.ais.icons.y, 35: lbjs.ais.icons.k,
	36: lbjs.ais.icons.b, 37: lbjs.ais.icons.b, 38: lbjs.ais.icons.w, 39: lbjs.ais.icons.w, 50: lbjs.ais.icons.g, 51: lbjs.ais.icons.g,
	52: lbjs.ais.icons.o, 53: lbjs.ais.icons.o, 54: lbjs.ais.icons.o, 55: lbjs.ais.icons.k, 56: lbjs.ais.icons.w, 57: lbjs.ais.icons.w,
	58: lbjs.ais.icons.g, 59: lbjs.ais.icons.g, 132: lbjs.ais.icons.home, 133: lbjs.ais.icons.track};
});
