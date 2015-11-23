<?php
require('settings.php');
	
$con = mysqli_connect($sqlserver, $username, $password, $dbname);
	
$myfile = fopen('data.xml', 'r') or die('Unable to open file!');
$data = fread($myfile, filesize('data.xml'));
fclose($myfile);
	
if($con)
{
	$xml = simplexml_load_string($data);

	foreach($xml->children() as $marker){
		$markerprops = $marker->attributes();
		
		$aisinfo = explode('!', $markerprops['ais']);
		
		$name = mysqli_real_escape_string($con, $markerprops['name']);
		$mmsi = mysqli_real_escape_string($con, $aisinfo[0]);
		$imo = mysqli_real_escape_string($con, $aisinfo[1]);
		$callsign = mysqli_real_escape_string($con, $aisinfo[2]);
		$destination = mysqli_real_escape_string($con, $aisinfo[3]);
		$date = mysqli_real_escape_string($con, $aisinfo[4]);
		
		$shipfromsql = mysqli_fetch_array(mysqli_query($con, 'SELECT * FROM ships WHERE MMSI=' . $mmsi . ';'));
		
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
		
		if(!mysqli_query($con, $sql))
		{
			header('Content-type: text/html');

			die('Error: ' . mysqli_error($con) . '<br /><pre>' . $sql . '</pre>');
		}
	}

	mysqli_close($con);
}

header('Content-type: text/xml');

echo $data;
?>