/*
var info = '<div id="info-window"> <div id="siteNotice"></div> <div id="infoTitle"> Company </div>  <i class="fas fa-map-marker"></i> City, District, </br> <i class="fas fa-building"></i> Street 123 <div id="infoMobile"> <i class="fas fa-mobile"></i> +48 100 200 300 </div> </div>'
var polygon = {"color":"#0099ff", "title":"Delivery area polygon!" ,"coordinates":[{"lat":52.12110974911002,"lng":21.091286765281204},{"lat":52.17040924996226,"lng":21.04047499770308},{"lat":52.19251308311206,"lng":21.04768477553511},{"lat":52.190829368155896,"lng":21.082703696433548},{"lat":52.155877891664815,"lng":21.124245749656204},{"lat":52.13249140154469,"lng":21.150681601706985}]}
var position = { lat: 52.1552112, lng: 21.0348507 };
var styles = [{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]}];
var image = "/media/img/marker.png";
var title = 'Map marker';
var polygons = [];
var markers = [];
var map = null;
var infoWindow;
*/

/* Map */

function InitMap(map_div, position, styles)
{
	// Map
	let map = new google.maps.Map(map_div, {
		zoom: 10,
		center: position,
		styles: styles,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		mapTypeControl: false
	});

	return map;
}

function Options(map)
{
	map.setOptions ({
		editable: false,
		draggable: false, //Disables the map drag
		maxZoom: 12, //Sets maximum zoom level
		minZoom: 5, //Sets minimum zoom level
		disableDefaultUI: true, //Removes the default controls
		scrollwheel: false //Disables the mouse scroll wheel
	});

	return map;
}

function Marker(map, position, icon, title = '', info = '', drag = false)
{
	// Info window
	infoWindow = InitInfoWindow()
	// marker
	let m = new google.maps.Marker({
		map: map,
		position: position,
		icon: icon,
		title: title,
		info: info,
		zIndex: 1000,
		draggable: drag,
		animation: google.maps.Animation.DROP
	});
	map.setCenter(position);
	return m
}

function MarkerInfo(marker)
{
	google.maps.event.addListener(marker, 'click', function (event) {
		console.log("Marker clicked: ", this.info, this)
		ShowInfoWindow(this.info, event, this.getMap())
	});
}

function MarkerEvent(marker, cb)
{
	marker.addListener("click", cb);
}

function Polygon(map, coordinates, color = '#ff6600', title = '', info = '')
{
	// Info window
	infoWindow = InitInfoWindow()
	// Polygon
	let p = new google.maps.Polygon({
		paths: coordinates,
		strokeColor: color,
		fillColor: color,
		strokeOpacity: 0.7,
		strokeWeight: 2,
		fillOpacity: 0.5,
		zIndex: 0,
		info: info,
		title: title
	});
	p.setMap(map)
	return p
}

function PolygonInfo(poly)
{
	google.maps.event.addListener(poly, 'click', function (event) {
		let poly = this
		let title = poly.title
		let info = poly.info
		let vertices = poly.getPath()
		console.log("Poly", title)
		ShowInfoWindow(info, event, poly.getMap())
	});
}

function PolygonInfoHover(poly)
{
	google.maps.event.addListener(poly, 'mouseover', function(event) {
		let poly = this
		let title = poly.title
		let info = poly.info
		let vertices = this.getPath()
		console.log("Poly hover", title)
		ShowInfoWindow(info, event, poly.getMap())
	 });
	 google.maps.event.addListener(poly, 'mouseout', function() {
		infoWindow.close();
	 });
}

function MultiPolygon(map, coords = [], color = '#ff9900', title = '', info = '')
{
	// Info window
	infoWindow = InitInfoWindow()
	// Polygon
	let bg_poly = new google.maps.Data.Polygon(coords)
	map.data.add({
		geometry: bg_poly
	});

	map.data.setStyle({
		strokeColor: color,
		fillColor: color,
		strokeOpacity: 0.7,
		strokeWeight: 2,
		fillOpacity: 0.5,
		zIndex: 0,
		info: info,
		title: title
	})

	return map.data
}

function MultiPolygonInfo(map)
{
	map.data.addListener('click', function (event) {
		let poly = map.data.getStyle()
		console.log("Poly", poly)
		ShowInfoWindow(poly.info, event, map)
	});
}

function DrawPolygon(map, color = '#55cc55', edit_callback = null)
{
	drawLayer = new google.maps.Data({map:map});
	drawLayer.setControls(['Polygon'])
	drawLayer.setStyle({
		editable: true,
		draggable: true,
		strokeColor: color,
		fillColor: color,
		strokeOpacity: 0.7,
		strokeWeight: 2,
		fillOpacity: 0.5,
		zIndex: 0
	});

	drawLayer.addListener('addfeature', function(e) {
		// e.feature.setProperty('featureID', 1)
		// e.feature.getProperty("featureID")

		let obj = e.feature.getGeometry()
		obj.forEachLatLng((p) => {
			console.log("Point" , p)
		})

		console.log("Polygon", obj)
	});

	// Poly drag event
	drawLayer.addListener('dragend', function(e) {
		let obj = e.feature.getGeometry()
		console.log("Dragged!", obj)
	})

	// Poly right click event (delete polygon)
	drawLayer.addListener('rightclick', function(e) {
		let obj = e.feature.getGeometry()
		console.log("Right click!", obj)

		// Remove polygon
		drawLayer.remove(e.feature);
	})

	// Poly edit event
	drawLayer.addListener('setgeometry', function(e) {

		let obj = e.feature.getGeometry()
		console.log("Set geometry!", obj)

		obj.forEachLatLng((o) => {
			console.log("Set geometry!", o)
		})

		if(edit_callback != null) {
			edit_callback(e, drawLayer)
		}
	})

	return drawLayer
}

function LoadGeoJson(map, url = "https://storage.googleapis.com/mapsdevsite/json/google.json")
{
	map.data.loadGeoJson(
		url
	);
}

function EditPolygonCallback(event, map_layer)
{
	console.log("Event callback", event)

	map_layer.forEach((p) => {
		console.log("Polygons:",p)
	})
}

function Icon(image, w = 90,h = 90)
{
	return { url: image, scaledSize: new google.maps.Size(w,h) };
}

function IconSvg()
{
	return {
		path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
		fillColor: "green",
		fillOpacity: 0.8,
		strokeWeight: 0,
		rotation: 0,
		scale: 1,
		anchor: new google.maps.Point(15, 30),
	}
}

function Position(lat,lng)
{
	return new google.maps.LatLng(lat,lng)
}

function InitInfoWindow()
{
	return new google.maps.InfoWindow()
}

function ShowInfoWindow(html, event, map)
{
	if (infoWindow) infoWindow.close()
	infoWindow.setContent(html)
	infoWindow.setPosition(event.latLng)
	infoWindow.open(map)
}

function CenterPolygon(coordinates = [], map)
{
	let bounds = new google.maps.LatLngBounds()
	for (i = 0; i < coordinates.length; i++) {
		bounds.extend(coordinates[i])
	}
	map.setCenter(bounds.getCenter())
	return bounds.getCenter()
}

function RemovePolygon(poly) {
	poly.setMap(null)
}

function DelMarkers(markers, map = null)
{
	for (let i = 0; i < markers.length; i++) {
		markers[i].setMap(map)
	}
}

function DeletePolygon(poly)
{
	poly.setMap(null)
}

function ClearOverlays(overlays)
{
	overlays.pop().setMap(null)
}

function PointInPolygon(point, poly) {
	// const polySample = [{ lat: 25.774, lng: -80.19 },{ lat: 18.466, lng: -66.118 },{ lat: 32.321, lng: -64.757 }];
	const p = new google.maps.Polygon({ paths: poly })
	return google.maps.geometry.poly.containsLocation(point, p)
}

function MarkerOnClick(map, icon, title = '', info = '')
{
	google.maps.event.addListener(map, "click", (event) => {
		console.log("Marker point", JSON.stringify(event.latLng))
		Marker(map, event.latLng, icon, title, info)
	})
}

function GetMapRectangle()
{
	// bounds_changed, idle
	google.maps.event.addListener(map, 'idle', function() {
		var bounds = map.getBounds()
		var ne = bounds.getNorthEast()
		var sw = bounds.getSouthWest()
		// do something
 	});
}

function IsBlank(str) {
	str = str.trim()
	return (!str || /^\s*$/.test(str) || str.length === 0)
}

function IsValidUrl(url) {
	var re = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
	return re.test(url)
}

// Validate email
function IsValidEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(email)
}

// Validate alias
function IsValidUsername(str)
{
	// const re = /^\w+$/;	// str with underscore
	const re = /^[a-zA-z]{1}[A-Za-z0-9_.]+$/
	return re.test(str)
}