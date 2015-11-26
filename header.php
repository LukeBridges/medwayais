<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" type="text/css" href="http://medwayais.co.uk/style1.css" />
<link rel="stylesheet" type="text/css" href="http://medwayais.co.uk/menu_style.css">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="medway, ais, kent, river, radio, 161.975, 162.025, mhz, MHz, MEDWAY, KENT, england, ships, boats, docks, thames, shipplotter, google, maps, sp2gm" />
<meta name="description" content="<?php echo $description; ?>" />
<script type="text/javascript" src="http://static.lukebridges.co.uk/lbjs/lbjs.js"></script>
<script type="text/javascript">
var addAnalytics = function(){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-61337654-1', 'auto');
	ga('send', 'pageview');
};

lbjs(document).ready(function(){
	if(!(-1 < document.cookie.indexOf("eubanner=true")))
	{
		lbjs("body").prepend("<div id=\"cookieBanner\" style=\"position:absolute;top:35px;left:0px;width:100%\">This site uses cookies for analytics purposes <input type=\"button\" value=\"I Agree\" /></div>");
		lbjs("#cookieBanner input").click(function(){
			addAnalytics();
			document.cookie = "eubanner=true; expires=Mon, 27 May 2100 00:00:01 GMT; path=/";
			lbjs("#cookieBanner").hide();
		});
	}else{
		addAnalytics();
	}
});
</script>
<title><?php echo $title; ?></title>
<?php if($noclose != true){ ?>
</head>
<body>
<?php include('menu.php'); ?>
<?php } ?>
