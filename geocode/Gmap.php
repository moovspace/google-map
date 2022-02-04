<?php
namespace App\Helpers;

class Gmap
{
	static function geocode($address, $key = '', $country = 'PL') {
		$address = urlencode($address);
		$url = "https://maps.googleapis.com/maps/api/geocode/json?components=country:{$country}&address={$address}&key={$key}";
		$json = file_get_contents($url);
		$resp = json_decode($json, true);

		if($resp['status']=='OK'){
			$lati = isset($resp['results'][0]['geometry']['location']['lat']) ? $resp['results'][0]['geometry']['location']['lat'] : "";
			$longi = isset($resp['results'][0]['geometry']['location']['lng']) ? $resp['results'][0]['geometry']['location']['lng'] : "";
			$addr = isset($resp['results'][0]['formatted_address']) ? $resp['results'][0]['formatted_address'] : "";

			if($lati && $longi && $addr){
				return [$lati, $longi, $addr, $address];
			}
		}

		return false;
	}
}