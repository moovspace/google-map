/* Create delivery area polygon */

var area = {"color":"#00C709","coordinates":[{"lat":52.12110974911002,"lng":21.091286765281204},{"lat":52.17040924996226,"lng":21.04047499770308},{"lat":52.19251308311206,"lng":21.04768477553511},{"lat":52.190829368155896,"lng":21.082703696433548},{"lat":52.155877891664815,"lng":21.124245749656204},{"lat":52.13249140154469,"lng":21.150681601706985}]}
var position = { lat: 52.1552112, lng: 21.0348507 };
var image = "/media/img/marker1.png";
var title = 'Map marker';
var infoWindow;
var markers = [];
var styles =[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    }
];

/* Draw polygon admin panel */

function initMapDrawPolygon(div = "map") {
	var set_poly;
	var polygons = [];

	var map_div = document.getElementById(div)
	if(!map_div) {
		console.log("Error map div", div)
		return;
	}
	const map = new google.maps.Map(map_div, {
		zoom: 11,
		center: position,
		styles: styles,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		mapTypeControl: false
	});

	const icon = {
		url: image,
		scaledSize: new google.maps.Size(50,50),
	};

	let el = document.getElementById("polygon")
	if(el) {
		let json = el.value;
		if(json) {
			json = JSON.parse(json)

			let coordinates = json.coordinates
			let poly_color = "#0099ff"
			if(json.color) {
				poly_color = json.color
			}

			set_poly = new google.maps.Polygon({
				paths: coordinates,
				strokeColor: poly_color,
				fillColor: poly_color,
				strokeOpacity: 0.9,
				strokeWeight: 4,
				fillOpacity: 0.5,
				zIndex: 1
			});
			set_poly.setMap(map);

			set_poly.addListener("click", (event) => {
				console.log(event)
			});

			// add to array
			polygons.push(set_poly);
		}
	}

	const drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.POLYGON,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: [
				google.maps.drawing.OverlayType.POLYGON,
			]
		},
		polygonOptions: {
			strokeColor: "#0099ff",
			strokeOpacity: 0.9,
			strokeWeight: 4,
			fillColor: "#0099ff",
			fillOpacity: 0.35,
			editable: false, // Disable polygon editing
			clickable: true, // Disable polygon clicking
			draggable: false, // Drag poly shape
			zIndex: 1,
		},
	});
	drawingManager.setMap(map);

	// After polygon creation
	google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
		if(event.type == 'polygon') { console.log("Hurray polygon!") }
		// Get polygon
		let i = event.overlay
		// Add to array
		polygons.push(i)
		// Get color
		let col = getPolygonColor()
		// Get from map set to input
		let coordinatesArray = i.getPath().getArray();
		let el = document.getElementById("polygon")
		if(el) { el.value = JSON.stringify({color: col, coordinates: coordinatesArray}) }
		// Disable drawing
		drawingManager.setDrawingMode(null);
	});

	// Change color
	let el2 = document.getElementById("polygon-change-color")
	if(el2) {
		el2.addEventListener('click',(ev) => {
			// Get color
			let col = getPolygonColor()
			// Polygons
			polygons.forEach((i) => {
				// Get from map set to input
				let coordinatesArray = i.getPath().getArray();
				let el = document.getElementById("polygon")
				if(el) { el.value = JSON.stringify({color: col, coordinates: coordinatesArray}) }
				// Style polygon
				i.setOptions({
					strokeColor: col,
					fillColor: col
				})
				// Delete polygon
				// i.setMap(null)
			})
		})
	}

	// Delete polygons
	let elc = document.getElementById("polygon-clear")
	if(elc) {
		elc.addEventListener('click', (ev) => {
			// Polygons
			polygons.forEach((i) => { i.setMap(null) })
			// Get color
			let col = getPolygonColor()
			// Enable drawing
			drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
			drawingManager.setOptions({
				polygonOptions: {
					strokeColor: col,
					fillColor: col
				}
			});

			let p = document.getElementById("polygon")
			p.value = '';
		})
	}
}

/* Contact map with delivery areas */

function initMapAboutUs(div = "map")
{
	infoWindow = new google.maps.InfoWindow()
	let map_div = document.getElementById(div)
	if(!map_div) {
		console.log("Map div does not exist", div)
		return;
	}

	const map = new google.maps.Map(map_div, {
		zoom: 12,
		center: position,
		styles: styles,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		mapTypeControl: false
	});

	const icon = {
		url: image,
		scaledSize: new google.maps.Size(90,90),
	};

	// Marker js
	var marker_position = getPosition(position.lat,position.lng)
	// From div
	let lat = map_div.dataset.lat
	let lng = map_div.dataset.lng
	if(lng && lat) {
		marker_position = getPosition(lat,lng)
	}
	// Marker position
	if(marker_position) {
		console.log("Marker", marker_position.lat(), marker_position.lng())
		const marker_title = map_div.dataset.marker_title
		const marker_city = map_div.dataset.marker_city
		const marker_district = map_div.dataset.marker_district
		const marker_street = map_div.dataset.marker_street
		const marker_mobile = map_div.dataset.marker_mobile
		const info = '<div id="info-window"> <div id="siteNotice"></div> <div id="infoTitle"> ' + marker_title + ' </div>  <i class="fas fa-map-marker"></i> ' + marker_city + ', ' + marker_district + ', </br>' + marker_street + ' <div id="infoMobile"> <i class="fas fa-mobile"></i> ' + marker_mobile + ' </div> </div>'

		const marker = new google.maps.Marker({
			map: map,
			position: marker_position,
			icon: icon,
			title: info,
			zIndex: 1000
		});
		map.setCenter(marker_position);

		google.maps.event.addListener(marker, 'click', function (event) {
			console.log("Marker", this.title, this)

			// Marker info window
			ShowInfoWindow(this.title, event, this.getMap())
		});
	}

	// Polygons
	let currency = map_div.dataset.currency;
	let json = map_div.dataset.poly;
	console.log("Polys", json);
	if(json) {
		let all = JSON.parse(json)
		if(all.list) {
			all.list.forEach(obj => {
				console.log("Poly", obj);

				let poly_color = "#0099ff"
				if(obj.color) {
					poly_color = obj.color
				}

				let title = obj.name
				let delivery_cost = obj.delivery_cost
				let delivery_min_cost = obj.delivery_min_cost
				let info = '<div id="info-window"> <div id="siteNotice"></div> <div id="infoTitle"> ' + title + ' </div> ' + delivery_cost + currency + ' / ' + delivery_min_cost + currency + '</div>'

				let poly = JSON.parse(obj.polygon)
				if(poly) {
					let coordinates = poly.coordinates
					let set_poly = new google.maps.Polygon({
						paths: coordinates,
						strokeColor: poly_color,
						fillColor: poly_color,
						strokeOpacity: 0.7,
						strokeWeight: 2,
						fillOpacity: 0.5,
						zIndex: 0,
						label: {
							text: title,
							color: "#FFFFFF",
							textShadow: "2px 2px 2px #000000"
						},
						title: info
					});
					set_poly.setMap(map);

					google.maps.event.addListener(set_poly, 'click', function (event) {
						let poly = this
						let title = poly.title
						let vertices = poly.getPath()
						console.log("Poly", title, poly, vertices)

						ShowInfoWindow(title, event, poly.getMap())
					});
				}
			});
		}
	}
}

/* Functions */

function delMarkers(map = null)
{
	for (let i = 0; i < markers.length; i++) {
		markers[i].setMap(map)
	}
}

function getToolTip()
{
	return '<div id="content">' +
	'<div id="siteNotice"></div>' +
	'<h1 id="firstHeading" class="firstHeading"> Title </h1>' +
	'<div id="bodyContent"> Html content goes here </div>' +
	"</div>";
}

function getPosition(lat,lng)
{
	return new google.maps.LatLng(lat,lng)
}

function centerPolygon(coordinates = [], map)
{
	let bounds = new google.maps.LatLngBounds()
	for (i = 0; i < coordinates.length; i++) {
		bounds.extend(coordinates[i])
	}
	map.setCenter(bounds.getCenter())
	return bounds.getCenter()
}

function getPolygonColor(col = "#0099ff")
{
	let e = document.getElementById("color")
	if(e) { col = e.value }
	return col
}

function removePolygon(poly) {
	poly.setMap(null)
}

function clearOverlays(overlays)
{
	overlays.pop().setMap(null)
}

function ChangePolygonColor(it)
{
	it.style.color = it.value
}

function ShowInfoWindow(html, event, map)
{
	if (infoWindow) infoWindow.close()
	infoWindow.setContent(html)
	infoWindow.setPosition(event.latLng)
	infoWindow.open(map)
}

/* Events */

window.addEventListener('load', (ev) => {
	console.log('About us map loading ...', ev)
	initMapAboutUs("map_delivery")

	console.log('Delivery map loading ...', ev)
	initMapDrawPolygon("map")
});


/* Checkout */

// Google Map Javascript Api, get location from address javascript api.
function CheckDeliveryAddress(ev, submit = true) {
	let empty = document.querySelectorAll(".empty")
	if(empty.length > 0) {
		alert("Dodaj produkty do koszyka!")
		return;
	}

	let len = 6
	let c = document.getElementById('map-city')
	let a = document.getElementById('map-address')
	let city = c.value
	let street = a.value
	let address = city + ' ' + street
	console.log("Address", address)
	if(address.length > len) {
		var geocoder = new google.maps.Geocoder()
		geocoder.geocode(
		{
			'address': address,
			componentRestrictions: {
				country: 'PL'
			}
		},
		function(results, status) {
			console.log("Geocoding json: ", results)
			if (status == 'OK') {
				let obj = results[0]
				if(obj != undefined){
					let loc = results[0].geometry.location
					let lng = loc.lng()
					let lat = loc.lat()
					console.log("Location Lng: ", lng)
					console.log("Location Lng: ", lat)

					var map_point = getPosition(lat,lng)
					let ok = CheckDeliveryLocation(map_point)
					if(ok) {
						if(submit) {
							// If error div does not exists
							let error = CheckOrderMinCost()
							console.log("Min cost:", error)
							if(error == null) {
								// Validate contact
								if(ValidateClient() == 1) {
									// Submit form
									let form = document.getElementById('order-form')
									form.submit()
								} else {
									alert("Podaj Imię, Nazwisko, adres email i numer telefonu!")
								}
							}
						}else{
							alert("Dowozimy pod ten adres.")
						}
					} else {
						alert("Nie dowozimy pod ten adres.")
					}
				}else{
					alert('Adres nie istnieje.')
				}
			}else{
				alert('Nie można sprawdzić adresu! Spróbuj później.')
			}
		})
	} else {
		alert("Proszę podaj miasto i adres.")
	}
}

function CheckOrderMinCost() {
	const error = document.querySelector('.delivery-min-order-error')
	if(error) {
		alert("Nie przekroczono kwoty minimalnego zamówienia.")
	}
	return error
}

function PointInPolygon(point, poly) {
	// const polySample = [{ lat: 25.774, lng: -80.19 },{ lat: 18.466, lng: -66.118 },{ lat: 32.321, lng: -64.757 }];
	const p = new google.maps.Polygon({ paths: poly });
	return google.maps.geometry.poly.containsLocation(point, p)
}

function CheckDeliveryLocation(point) {
	// Get poly from html
	let p = document.querySelectorAll('.polygon-array');
	let res = 0;
	if(p) {
		p.forEach((i) => {
			let poly = i.innerHTML
			let poly_id = i.dataset.id
			console.log('Polygon Id:', poly_id, 'Array:', poly);
			let o = JSON.parse(poly)
			let poly_array = o.coordinates;

			if(!res) {
				if(PointInPolygon(point, poly_array)) {
					console.log("Marker in delivery area!");
					res = 1;
					// Update delivery session
					UpdateDeliverySession(poly_id);
				}else{
					console.log("Error delivery area location!");
					res = 0;
				}
			}
		});
	}

	return res;
}

function UpdateDeliverySession(poly_id) {
	fetch(encodeURI('/update/delivery/session?id=' + poly_id)).then(function(res) {
		console.log("Update delivery session: ", res);
		return res.text();
	}).then(function(txt) {
		console.log("Update delivery session: ", txt);
		// Update cart here
		loadCartProducts();
		loadCartProductsQuantity();
		loadCartProductsCost();
	})
}

function ValidateClient() {
	let e1 = document.getElementById('i-name');
	let e2 = document.getElementById('i-lastname');
	let e3 = document.getElementById('i-email');
	let e4 = document.getElementById('i-mobile');

	let s1 = ''
	if(e1) { s1 = e1.value }
	let s2 = ''
	if(e2) { s2 = e2.value }
	let s3 = ''
	if(e3) { s3 = e3.value }
	let s4 = ''
	if(e4) { s4 = e4.value }

	if(IsBlank(s1) || IsBlank(s2) || IsBlank(s3) || IsBlank(s4) || !IsValidEmail(s3)) {
		return 0
	}

	return 1
}

function IsBlank(str) {
	str = str.trim()
    return (!str || /^\s*$/.test(str) || str.length === 0);
}

function isValidUrl(url) {
	var re = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	return re.test(url);
}

// Validate email
function IsValidEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

// Validate alias
function IsValidUsername(str)
{
	// const re = /^\w+$/;	// str with underscore
	const re = /^[a-zA-z]{1}[A-Za-z0-9_.]+$/;
	return re.test(str);
}