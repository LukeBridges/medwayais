var maplat = 51.43245,
	maplon = 0.688333333,
	my_lat = 51.3327,
	my_lon = 0.4439,
	map, tooltip, gmarkers,
	refreshInterval = 60,
	numrefresh = 180,
	icon, htmls, vectors,
	countDownTime = refreshInterval + 1,
	refreshcounter = 0,
	counter, maxrange = 0,
	maxname, maxmmsi, maxlat, maxlon, maxbearing, maxindex,

makeinfo = function(Lat, Lon, name, type, aisstr, i)
{
	var ais = aisstr.split('!'),
		mmsi  = ais[0],
		imo   = ais[1],
		call  = ais[2],
		dest  = ais[3],
		eta   = ais[4],
		speed = ais[5],
		course= ais[6],
		status= lbjs.ais.getStatus(ais[7]),
		length= ais[8],
		width = ais[9],
		draft = ais[10],
		mtime = ais[11],	
		aisclass = ais[13],
		callstr, deststr, etastr, spdstr, sizestr, mmsistr, imostr, recstr, statusstr, rangestr, classstr,

		rb = lbjs.ais.rangeBearing(my_lat, my_lon, Lat, Lon),
	
		latstr = ((Lat < 0) ? 'S' + Math.abs(Lat) : 'N'+ Lat),
		lonstr = ((Lon < 0) ? 'W' + Math.abs(Lon) : 'E'+ Lon);
		
	callstr = deststr = etastr = spdstr = sizestr = mmsistr = imostr = recstr = statusstr = rangestr = classstr = '';
	
	if(rb.range > maxrange)
	{
		maxrange = rb.range;
		maxname = name;
		maxmmsi = mmsi;
		maxlat = Lat;
		maxlon = Lon;
		maxbearing = rb.bearing;
		maxindex = i;
	}
	
	if((type < 100) || (type === 133)){
		callstr = '<tr><td>Callsign:</td><td>' + call + '</td></tr>\n';
		deststr = '<tr><td>Destination:</td><td>' + dest + '</td></tr>\n';
		etastr = '<tr><td>ETA:</td><td>' + eta + '</td></tr>\n';
	}
	if(type < 100){
		spdstr = '<tr><td>Speed&Dir:</td><td>' + speed + ' kts / ' + course + '<sup>o</sup></td></tr>\n'; 
		sizestr = '<tr><td>Size:</td><td>' + length + 'm x ' + width + 'm x ' + draft + 'm</td></tr>\n';
	}
	if(mmsi !== ''){
		mmsistr = '<tr><td>MMSI:</td><td><a href="/db.php?mmsi=' + mmsi + '">' + mmsi + '</a></td></tr>\n';
	}
	if(imo > 0){
		imostr = '<tr><td>IMO:</td><td>' + imo + '</td></tr>\n';
	}
	if(mtime !== ''){
		recstr = '<tr><td><sup>Received:&nbsp;</sup></td><td><sup>' + mtime + '</sup></td></tr>\n';
	}
	if(status !== ''){
		statusstr = '<tr><td>Status:</td><td>' + status + '</td></tr>\n';
	}
	if(rb.range !== ''){
		rangestr = '<tr><td>Range&Bear:&nbsp;&nbsp;</td><td>' + rb.range + 'nm / ' + rb.bearing + '<sup>o</sup>T</td></tr>\n';
	}
	if(aisclass !== ''){
		classstr = '<tr><td>AIS Class:</td><td>' + lbjs.ais.getClass(aisclass) + '</td></tr>\n';
	}
  
	return '<div class="gpopup"><table cellpadding="0" cellspacing="0">\n' +
		'<tr><td>Name:</td><td>' + name + '</a></td></tr>\n' +
		callstr + mmsistr + imostr + statusstr + deststr + etastr +
		'<tr><td>Type:</td><td>' + lbjs.ais.getType(type) + '</td></tr>\n' + sizestr + spdstr +
		'<tr><td>Location:</td><td>' + latstr + '<sup>o</sup> / ' + lonstr + '<sup>o</sup></td></tr>\n' +
		rangestr + classstr + '<tr><td colspan="2">&nbsp;</td></tr>\n' + recstr + '</table></div>\n';
},
mapIcon = function(image, i)
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
addVector = function(map, from, deltax, deltay)
{
	if(deltax === 0 && deltay === 0){return null;}
	var to = new google.maps.LatLng(from.lat() + deltay, from.lng() + deltax),
		polyline = new google.maps.Polyline({
		path: [from, to],
		strokeColor: "#00ff00",
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	polyline.setMap(map);
	return polyline;
},
createMarker = function(map, point, name, html, iconz)
{
	var marker = new google.maps.Marker({map: map, position: point, icon: iconz});
	if(html)
	{
		marker.infowindow = new google.maps.InfoWindow({maxWidth: 400, content: '<div id="tooltip"><span>' + html + '</span></div>'});
		google.maps.event.addListener(marker, "click", function(){
			marker.infowindow.open(map, marker);
		});
	}
	marker.tooltip = new Tooltip({marker: marker, content: name, cssClass: 'tooltip'});

	return marker;
},
findship = function(i)
{
	gmarkers[i].infowindow.open(map, gmarkers[i]);
},
countDown = function()
{
	countDownTime--;
	document.getElementById("countDownText").innerHTML = countDownTime;
	if(countDownTime <= 0)
	{
		countDownTime = refreshInterval;
		clearTimeout(counter);
		autoUpdate();
		return;
	} 
	counter = setTimeout(countDown, 1000);
},
doUpdate = function(data)
{
	if(!data.documentElement || !Tooltip){return;}
	var xmlmarker = data.documentElement.getElementsByTagName("marker"),
		movehtml = '',
		dockhtml = '',
		sepmove  = '',
		sepdock  = '',
		movecnt  = 0,
		dockcnt  = 0,
		lat, lon, name, deltax, deltay, type, ais, aiss, html, icon, aisclass, i, point,
		shipmove = document.getElementById("shipmove"),
		shipdock = document.getElementById("shipdocked"),
		shiptime = document.getElementById("shiptime"),
		shipfar = document.getElementById("shipfar"),
		currentTime = new Date();
	
	if(!gmarkers){gmarkers = [];}
	if(!htmls){htmls = [];}
	if(!vectors){vectors = [];}
	
	for(i = 0; i < xmlmarker.length; i += 1)
	{
		lat = parseFloat(xmlmarker[i].getAttribute("lat"));
		lon = parseFloat(xmlmarker[i].getAttribute("lon"));
		name = xmlmarker[i].getAttribute("name");
		deltax = parseFloat(xmlmarker[i].getAttribute("dx"));
		deltay = parseFloat(xmlmarker[i].getAttribute("dy"));
		type = parseInt(xmlmarker[i].getAttribute("type"), 10);
		htmls[i] = makeinfo(lat, lon, name, type, xmlmarker[i].getAttribute("ais"), i);
		ais = xmlmarker[i].getAttribute("ais");
		aiss = ais.split('!');
		aisclass = aiss[13];
		icon = lbjs.ais.getColour(type);
		if(gmarkers[i])
		{
			google.maps.event.clearListeners(gmarkers[i], "click");
			google.maps.event.clearListeners(gmarkers[i], "mouseover");
			google.maps.event.clearListeners(gmarkers[i], "mouseout");
			gmarkers[i].setMap(null);
		}
		point = new google.maps.LatLng(lat, lon);
		gmarkers[i] = createMarker(map, point, name, htmls[i], icon);
		if(vectors[i]){vectors[i].setMap(null);}
		vectors[i] = addVector(map, point, deltax, deltay);
		html = "<a href='javascript:findship(" + i + ")'>" + name + "</a>";
		if((Math.abs(deltax) > 0 || Math.abs(deltay) > 0) && aisclass !== 'W')
		{
			movehtml += sepmove + html;
			sepmove = ", ";
			movecnt += 1;
		}else{
			dockhtml += sepdock + html;
			sepdock = ", ";
			dockcnt += 1;
		}
	}
		
	shipmove.innerHTML ="<h3 style='color: black; font-weight: bold;'>Underway</h3>" + movehtml + ".";
	shipdock.innerHTML ="<h3 style='color: black; font-weight: bold;'>Docked, Anchored or Fixed</h3>" + dockhtml + ".";
	var timeText = currentTime.toString();
	timeText = timeText.substring(0, timeText.indexOf("GMT") + 3);
	shiptime.innerHTML = timeText;

	html = "<a href='javascript:findship(" + maxindex + ")'>" + maxname + "</a>";
	
	shipfar.innerHTML = '&quot;' + html + '&quot; Range: ' + maxrange; 
	
	maxrange = 0;
},
autoUpdate = function()
{
	lbjs.ajax.get({url: "data.php?" + Math.random(), responseType: "XML", success: doUpdate});
  
	if(refreshcounter++ < numrefresh)
	{	
		window.setTimeout(countDown, 1000);
	}else{
		document.getElementById("countDownText").innerHTML = "Press REFRESH to continue updates.";
	}
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
	
	lbjs.ais.icons.home = mapIcon("http://medwayais.co.uk/icons/marker.png", 2);
	createMarker(map, new google.maps.LatLng(my_lat, my_lon), 'Receiving Point', null, lbjs.ais.icons.home);

	map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('keyTable'));
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('shipStats'));

	tooltip = document.createElement("div");
	tooltip.style.visibility = "hidden";

	lbjs.ais.icons.k = mapIcon("http://medwayais.co.uk/icons/mm_20_gray.png", 0);
	lbjs.ais.icons.b = mapIcon("http://medwayais.co.uk/icons/mm_20_blue.png", 0);
	lbjs.ais.icons.a = mapIcon("http://medwayais.co.uk/icons/mm_20_red.png", 0);
	lbjs.ais.icons.g = mapIcon("http://medwayais.co.uk/icons/lifebot.png", 0);
	lbjs.ais.icons.hs = mapIcon("http://medwayais.co.uk/icons/hispdcrft.png", 0);
	lbjs.ais.icons.dr = mapIcon("http://medwayais.co.uk/icons/mm_20_green.png", 0);
	lbjs.ais.icons.r = mapIcon("http://medwayais.co.uk/icons/mm_20_yellow.png", 0);
	lbjs.ais.icons.w = mapIcon("http://medwayais.co.uk/icons/mm_20_white.png", 0);
	lbjs.ais.icons.y = mapIcon("http://medwayais.co.uk/icons/mm_20_brown.png", 0);
	lbjs.ais.icons.m = mapIcon("http://medwayais.co.uk/icons/mm_20_black.png", 0);
	lbjs.ais.icons.o = mapIcon("http://medwayais.co.uk/icons/mm_20_purple.png", 0);
	lbjs.ais.icons.n = mapIcon("http://medwayais.co.uk/icons/mm_20_brown.png", 0);
	lbjs.ais.icons.track = mapIcon("http://medwayais.co.uk/icons/shiptrkicon.gif", 1);
  
	lbjs.ais.iconLookup = {30: lbjs.ais.icons.y, 31: lbjs.ais.icons.o, 32: lbjs.ais.icons.o, 33: lbjs.ais.icons.dr, 34: lbjs.ais.icons.y, 35: lbjs.ais.icons.k,
	36: lbjs.ais.icons.b, 37: lbjs.ais.icons.b, 38: lbjs.ais.icons.w, 39: lbjs.ais.icons.w, 50: lbjs.ais.icons.g, 51: lbjs.ais.icons.g,
	52: lbjs.ais.icons.o, 53: lbjs.ais.icons.o, 54: lbjs.ais.icons.o, 55: lbjs.ais.icons.k, 56: lbjs.ais.icons.w, 57: lbjs.ais.icons.w,
	58: lbjs.ais.icons.g, 59: lbjs.ais.icons.g, 132: lbjs.ais.icons.home, 133: lbjs.ais.icons.track};
  
	autoUpdate();
});
