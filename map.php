<?php
$description = 'Medway AIS Map Output from Shipplotter';
$title = 'Medway AIS Map';
$noclose = true;
include('header.php');
?>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAd_Tpb8Ocs8aRo6FMUfqAA3DaAaWfMb3k&amp"></script>
<script type="text/javascript" src="http://static.lukebridges.co.uk/lbjs/ext/lbjs.ais.js"></script>
<script type="text/javascript" src="http://static.lukebridges.co.uk/lbjs/ext/lbjs.ajax.js"></script>
<script type="text/javascript" src="http://static.lukebridges.co.uk/medwayais/tooltip.js"></script>
<script type="text/javascript" src="http://static.lukebridges.co.uk/medwayais/mapv3.js"></script>
<link rel="stylesheet" type="text/css" href="http://static.lukebridges.co.uk/medwayais/mapstyle.css">
</head>
<body>
<h1>Medway AIS Map</h1>
<?php include('menu.php'); ?>
<div id="map" style="width:100%;height:100%"></div>
<div id="keyTable" class="mapPane">
<div id="shiptime"></div>
<div id="countDownTextWrapper">Next plot update in <span id="countDownText">0</span> seconds.</div>
<table>
<tr><td id="blueballoon">Pleasure/Passenger</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_blue.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="hispdcrftballoon">Highspeed Craft</td><td><img src="http://static.lukebridges.co.uk/medwayais/hispdcrft.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="yellowballoon">Cargo</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_yellow.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="blackballoon">Tanker</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_black.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="greenballoon">Dredger</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_green.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="whiteballoon">Other/Unknown</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_white.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="brownballoon">Dive/Fishing</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_brown.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="purpleballoon">Tug/Pilot</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_purple.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="grayballoon">Military/Police</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_gray.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="lifebotmarker">Search &amp; Rescue</td><td><img src="http://static.lukebridges.co.uk/medwayais/lifebot.png" height="31" width="50" alt="" style="height:31px;width:50px;" /></td></tr>
<tr><td id="redmarker">NavAid/Special</td><td><img src="http://static.lukebridges.co.uk/medwayais/mm_20_red.png" height="20" width="12" alt="" /></td></tr>
<tr><td id="homemarker">Receiving Station</td><td><img src="http://static.lukebridges.co.uk/medwayais/marker.png" height="34" width="20" alt="" style="height:34px;width:20px;" /></td></tr>
</table>
</div>
<div id="shipStats" class="mapPane">
<div id="shipmove"></div>
<div id="shipdocked"></div>
<h3><span>Farthest Ship:</span></h3>
<div id="shipfar"></div>
</div>
<div style="text-align: left;">
<dl><dt><span id="scripttitle">based on "Live Ship Movements - ShipPlotter Sharing" by</span></dt>
<span id="dv">D!V</span> - DigImage Visions<br />
W. Curt Deegan<br />
Boca Raton, Florida, USA<br />
Email: wwwr (at) earthlink (dot) net
</dl></div>
<div id="disclaimer">
<span>Disclaimer:</span>&nbsp;
The information contained herein is intended for entertainment purposes only.<br />
No representation as to its accuracy is made or implied.<br />
This information SHOULD NOT be used for navigational purposes.
</div>
</body>
</html>
