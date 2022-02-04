/* Google Map Geocoding */
let poly = [{ lat: 25.774, lng: -80.19 },{ lat: 18.466, lng: -66.118 },{ lat: 32.321, lng: -64.757 }];

function geocode(city, street, country_code = 'PL') 
{
	let address = city + ' ' + street	
	if(address.length > 6) 
	{
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			'address': address,
			componentRestrictions: { country: country_code }
		},
		function(results, status) {
			// console.log("Geocoding json: ", results);
			if (status == 'OK') {
				let obj = results[0]
				if(obj != undefined) {
					let loc = results[0].geometry.location
					let point = {lat: loc.lat(), lng: loc.lng(), city: city, street: street}
					
					console.log("Location", point)
					// Test delivery addres here					
				}
			}
		})
	}
}

function getPoint(lat,lng)
{
	return new google.maps.LatLng(lat,lng)
}

function isPointInPolygon(point, poly) 
{	
	const p = new google.maps.Polygon({ paths: poly });
	return google.maps.geometry.poly.containsLocation(point, p)
}