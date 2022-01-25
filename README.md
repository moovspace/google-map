# Google Map JavaScript API
How to create google map marker and polygon.

### Load map scripts add js api key
Add google map api key into index.html
```html
<!DOCTYPE html>
<html lang="pl">
<head>
	<title>Google map marker</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- Add google map api key here -->
	<script defer src="https://maps.googleapis.com/maps/api/js?key=MAP-API-KEY-HERE&libraries=drawing,geometry"></script>
	<script src="/map.js"></script>
	<script src="/main.js"></script>
	<link href="style.css" rel="stylesheet">
</head>
<body>
	<div id="map_div" class="map"></div>
</body>
</html>
```

### Create map marker and polygon
Create file main.js
```js
var position = { lat: 52.1552112, lng: 21.0348507 };
var polygon = {"color":"#0099ff", "title":"Delivery area polygon!" ,"coordinates":[{"lat":52.12110974911002,"lng":21.091286765281204},{"lat":52.17040924996226,"lng":21.04047499770308},{"lat":52.19251308311206,"lng":21.04768477553511},{"lat":52.190829368155896,"lng":21.082703696433548},{"lat":52.155877891664815,"lng":21.124245749656204},{"lat":52.13249140154469,"lng":21.150681601706985}]}
var info = '<div id="info-window"> <div id="siteNotice"></div> <div id="infoTitle"> Company </div>  <i class="fas fa-map-marker"></i> City, District, </br> <i class="fas fa-building"></i> Street 123 <div id="infoMobile"> <i class="fas fa-mobile"></i> +48 100 200 300 </div> </div>'
var styles = [{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]}];
var image = "/media/img/marker.png";
var title = 'Map marker';
var polygons = [];
var markers = [];
var map = null;
var infoWindow;

window.addEventListener('load', (ev) => {
	// Map div
	let map_div = document.getElementById("map_div")

	// Draw and center map
	map = InitMap(map_div, position, styles)

	// Marker
	let marker = Marker(map, position, Icon(image,60,60), 'Map marker', info)
	// Marker click info popup
	MarkerInfo(marker)

	// Polygon
	let poly = Polygon(map, polygon.coordinates, polygon.color, polygon.title, 'Delivery area polygon!')
	// Polygon click info popup
	PolygonInfo(poly)

	// Create marker on click
	MarkerOnClick(map, Icon(image,60,60),'Map marker', info)
});
```

### Map div style
Set map div height style.css
```css
.map {
	float: left; width: 100%; height: 500px;
}
```

### Map infoWindow style
```css
/* InfoWindow html style */
#info-window {
	color: #fff;
	padding: 10px;
	text-align: left;
	font-weight: 500;
	min-width: 250px;
	font-size: 15px;
	font-family: 'Open Sans', Tahoma, Arial, sans-serif;
	overflow: hidden;
	box-sizing: border-box;
}
#info-window i {
	min-width: 20px;
}
#infoTitle {
	font-weight: 700;
	font-size: 18px;
}

/* style google info window */
.gm-style-iw {
	color: #fff !important;
	background: #111111ee !important;
	border-radius: 0px !important;
}
.poi-info-window div {
	color: #fff !important;
	background: transparent !important;
	font-size: 14px;
	font-weight: 400;
	font-family: 'Open Sans', Tahoma, Arial, sans-serif;
	padding: 0px;
}
.poi-info-window .title {
	font-weight: 700;
}
.poi-info-window a {
	font-weight: 700;
	color: #5C5 !important;
	background: transparent !important;
}

/* triangle bottom */
.gm-style-iw-t {
	position: relative !important;
}
.gm-style-iw-t::after {
	position: absolute !important;
	background: transparent !important;
	box-shadow: none !important;
	border: 0px !important;
	border-top: 10px solid #111111ee !important;
	border-left: 10px solid transparent !important;
	border-right: 10px solid transparent !important;
	width: 0;
	height: 0;
	border-style: inset;
	box-sizing: border-box;
	transform: translate(-50%, 0%) !important;
}
.gm-ui-hover-effect {
	position: relative;
	opacity: 1;
	top: 5px !important;
	right: 5px !important;
	width: 15px !important;
	height: 15px !important;
	color: #fff !important;
	background: transparent !important;
}
/* Close info fontawesome icon cross */
.gm-ui-hover-effect::after {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	font-family: 'Font Awesome 5 Free';
	font-style: normal;
	font-variant: normal;
	font-weight: 900;
	content: "\f00d";
}
.gm-ui-hover-effect:hover::after {
	color: #f23 !important;
}
.gm-ui-hover-effect img {
	display: none !important
}
```
