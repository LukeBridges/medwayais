<?php
require('settings.php');
	
$con = new mysqli($sqlserver, $username, $password, $dbname);
	
$myfile = fopen('data.xml', 'r') or die('Unable to open file!');
$data = fread($myfile, filesize('data.xml'));
fclose($myfile);
	
if($con)
{
	$xml = simplexml_load_string($data);

	foreach($xml->children() as $marker){
		$markerprops = $marker->attributes();
		
		$aisinfo = explode('!', $markerprops['ais']);
		
		$name = $con->escape_string($markerprops['name']);
		$mmsi = $con->escape_string($aisinfo[0]);
		$imo = $con->escape_string($aisinfo[1]);
		$callsign = $con->escape_string($aisinfo[2]);
		$destination = $con->escape_string($aisinfo[3]);
		$date = $con->escape_string($aisinfo[4]);
		
		$shipfromsql = $con->query($con, 'SELECT * FROM ships WHERE MMSI=' . $mmsi . ';');
		
		$sql = 'INSERT INTO ships (MMSI, Name, IMO, Callsign) VALUES (' 
				. $mmsi . ', "' 
				. $name . '", ' 
				. $imo . ', "' 
				. $callsign . '")';
		
		$updatename = function(){return (stripos($shipfromsql['Name'], $mmsi) !== false);};
		$updateimo = function(){return ($shipfromsql['IMO'] == '0' || $shipfromsql == '');};
		$updatecallsign = function(){return ($shipfromsql['Callsign'] == '' || $shipfromsql['Callsign'] == 'unknown');};
		$updateany = $updatename || $updateimo || $updatecallsign;
		
		if($updateany){
			$sql = $sql . ' ON DUPLICATE KEY UPDATE';
		}
		if($updateimo){
			$sql = $sql . ' IMO="' . $imo . '"';
		}
		if($updatecallsign){
			if($updateimo){
				$sql = $sql . ',';
			}
			$sql = $sql . ' CALLSIGN="' . $callsign . '"';
		}
		if($updatename){
			if($updateimo || $updatecallsign){
				$sql = $sql . ',';
			}
			$sql = $sql . ' Name="' . $name . '"';
		}
		
		$sql = $sql . ';';
		
		if(!$con->query($sql))
		{
			header('Content-type: text/html');

			die('Error: ' . $con->error . '<br /><pre>' . $sql . '</pre>');
		}
		
		$sql = 'INSERT IGNORE INTO positions (lat, lon, type) VALUES ("' 
				. $con->escape_string($markerprops['lat']) . '", "' 
				. $con->escape_string($markerprops['lon']) . '", "' 
				. $con->escape_string($markerprops['type']) . '") ON DUPLICATE KEY UPDATE type="'
				. $con->escape_string($markerprops['type']) . '";';
		
		if(!$con->query($sql))
		{	
			header('Content-type: text/html');

			die('Error: ' . $con->error . '<br /><pre>' . $sql . '</pre>');
		}
	}

	$con->close();
}

header('Content-type: text/xml');

echo $data;
?>
