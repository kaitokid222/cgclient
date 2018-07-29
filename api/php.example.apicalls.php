<?php
//ingore ssl
$stream = stream_context_create(array("ssl"=>array("verify_peer"=>false,"verify_peer_name"=>false),'http'=>array('timeout'=>30)));
$top100 = json_decode(file_get_contents('https://coregrounds.com/app/scoregrounds', 0, $stream), true);
$topraw = array_slice($top100["data"]["casual"],0,5);
$top = array();
foreach($topraw as $row){
	$t = array();
	$t["id"] = $row["uid"];
	$pdataraw = json_decode(file_get_contents('https://coregrounds.com/app/profile/' . $t["id"], 0, $stream), true);
	$pdata = $pdataraw["profile"];
	$mdataraw = json_decode(file_get_contents('https://coregrounds.com/app/matches/' . $t["id"], 0, $stream), true);
	$mdata = $mdataraw["data"];
	$mcount = count($mdata);
	
	$t["name"] = $row["name"];
	$t["level"] = $row["level"];
	$t["earnedcre"] = $pdata["credits"]["earned"];
	$t["achievementProgress"] = "" . number_format(100 * $pdata["achievementProgress"], 2) . " %";
	$t["winStreak"] = $pdata["winStreak"];
	$t["unlocks"] = count($pdata["unlocks"]);
	$t["levelprog"] = "" . number_format(100 * $pdata["level"]["progress"], 2) . " %";
	$t["wins"] = $pdata["season"]["casual"]["wins"];
	$t["games"] = $pdata["season"]["casual"]["games"];
	$t["perc"] = 100 * $t["wins"] / $t["games"];
	$t["rp"]["meter"] = "";
	$t["rp"]["duration"] = 0;
	$t["rp"]["la"] = 0;
	$t["rp"]["ac"] = 0;
	$t["rp"]["ae"] = 0;

	foreach($mdata as $match){
		$la = intval($match["ended"]);
		if($t["rp"]["la"] < $la)
			$t["rp"]["la"] = $la;
		$t["rp"]["duration"] += $match["duration"];
		$t["rp"]["ac"] += $match["coins"];
		$t["rp"]["ae"] += $match["xp"];
		if($match["won"] == $match["team"]){
			$t["rp"]["meter"] = $t["rp"]["meter"] . "<p style=\"color:green;display:inline;\">+</p> ";
		}else{
			$t["rp"]["meter"] = $t["rp"]["meter"] . "<p style=\"color:red;display:inline;\">-</p> ";
		}
	}

	$t["rp"]["duration"] = number_format(($t["rp"]["duration"] / $mcount),0);
	if(($t["rp"]["duration"]-((floor($t["rp"]["duration"] / 60))*60)) < 10)
		$zerofix = "0";
	else
		$zerofix = "";

	$t["rp"]["duration"] = floor($t["rp"]["duration"] / 60) . ":" . $zerofix . ($t["rp"]["duration"]-((floor($t["rp"]["duration"] / 60))*60));
	$t["rp"]["ac"] = number_format(($t["rp"]["ac"] / $mcount),0);
	$t["rp"]["ae"] = number_format(($t["rp"]["ae"] / $mcount),0);
	$top[] = $t;
	unset($t);
}
?>