<?php 
$description = 'Medway AIS Database Viewer';
$title = 'Medway AIS Database';
$noclose = true;
include('header.php');
require('settings.php');

$mmsi = 0;
$name = "";
if(isset($_GET['mmsi'])){$mmsi = $_GET['mmsi'];}
if(isset($_GET['name'])){$name = $_GET['name'];}

$search = '';
if($mmsi != 0){
	$search = $mmsi;
}else if($name != ""){
	$search = $name;
}
?>
<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.3/css/jquery.dataTables.css">
<script type="text/javascript" src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script type="text/javascript" src="//cdn.datatables.net/1.10.3/js/jquery.dataTables.min.js"></script>
<script type="text/javascript">
lbjs(document).ready(function(){
	$('table').dataTable({"pagingType": "full_numbers"});
	$('#DataTables_Table_0_filter input').prop("value","<?php echo $search; ?>").trigger("input");
});
</script>
<style type="text/css">
html, body{background:#9de;}
.dataTables_wrapper{background-color: #ccc;font-family: "Segoe UI";font-size: 14px;}
a, td{color: #000;}
</style>
</head>
<body>
<?php include('menu.php'); ?>
<?php flush(); ?>
<center>
<h1>Medway AIS Database</h1>
<table bgcolor="#ccc" style="border: #ccc solid 0px">
<thead><tr><th>MMSI</th><th>Name</th><th>IMO</th><th>Callsign</th></tr></thead>
<tfoot><tr><th>MMSI</th><th>Name</th><th>IMO</th><th>Callsign</th></tr></tfoot>
<tbody>
<?php
$con = new mysqli($sqlserver, $username, $password, $dbname);
if($con)
{
	$result = $con->query('SELECT * FROM ships');
	while($row = $result->fetch_assoc()){
		echo '<tr><td>' . $row['MMSI'] . '</td><td>' . $row['Name'] . '</td><td>' . $row['IMO'] . '</td><td>' . $row['Callsign'] . '</td></tr>';
	}
}
else
{
	die('<tr><td colspan="4">Failed to connect to MySQL: ' . $con->error . '</td></tr>');
}
$con->close();
?>
</tbody>
</table>
</center>
</body>
</html>
