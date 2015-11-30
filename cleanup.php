<?php
require('settings.php');

$output = true;
if(php_sapi_name() == "cli"){
    $output = false;
}
	
$con = new mysqli($sqlserver, $username, $password, $dbname);

if($con->connect_error){
    die('Error : ('. $con->connect_errno .') '. $con->connect_error);
}
	
$IMOclean = $con->query('SELECT mmsi FROM ships WHERE IMO="0" OR IMO="" OR IMO=" ";');
$CSNclean = $con->query('SELECT mmsi FROM ships WHERE Callsign="unknown" OR Callsign="" OR Callsign=" ";');

$toclean = [];
$toclean['imo'] = [];
$toclean['csn'] = [];

if($output){echo '<h1>IMO to clean</h1>';}
while($ship = $IMOclean->fetch_array()){
	$toclean['imo'][] = $ship['mmsi'];
	if($output){echo $ship['mmsi'] . '<br />';}
	flush();
}
if($output){echo '<h1>Callsign to clean</h1>';}
while($ship = $CSNclean->fetch_array()){
	$toclean['csn'][] = $ship['mmsi'];
	if($output){echo $ship['mmsi'] . '<br />';}
	flush();
}

$IMOclean->close();
$CSNclean->close();

if($output){echo '<h1>Cleaning IMO...</h1>';}
foreach($toclean['imo'] as $mmsi){
	if($output){echo 'UPDATE ships SET imo=NULL WHERE mmsi=' . $mmsi . ';<br />';}
	if(!$con->query('UPDATE ships SET imo=NULL WHERE mmsi=' . $mmsi . ';'))
	{
		if($output){echo 'Errormessage: ' . $con->error . '<br />';}
	}
	flush();
}

if($output){echo '<h1>Cleaning Callsign...</h1>';}
foreach($toclean['csn'] as $mmsi){
	if($output){echo 'UPDATE ships SET callsign=NULL WHERE mmsi=' . $mmsi . ';<br />';}
	if(!$con->query('UPDATE ships SET callsign=NULL WHERE mmsi=' . $mmsi . ';'))
	{
		if($output){echo 'Errormessage: ' . $con->error . '<br />';}
	}
	flush();
}

$con->close();

if($output){echo '<h1>Done</h1>';}
?>
