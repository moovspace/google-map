/* Map marker */

var position = { lat: 52.1552112, lng: 21.0348507 };
// var position = { lat: -33.872, lng: 151.252 };
var polygon = {"color":"#0099ff", "title":"Delivery area polygon!" ,"coordinates":[{"lat":52.12110974911002,"lng":21.091286765281204},{"lat":52.17040924996226,"lng":21.04047499770308},{"lat":52.19251308311206,"lng":21.04768477553511},{"lat":52.190829368155896,"lng":21.082703696433548},{"lat":52.155877891664815,"lng":21.124245749656204},{"lat":52.13249140154469,"lng":21.150681601706985}]}
var info = '<div id="info-window"> <div id="siteNotice"></div> <div id="infoTitle"> Company </div>  <i class="fas fa-map-marker"></i> City, District, </br> <i class="fas fa-building"></i> Street 123 <div id="infoMobile"> <i class="fas fa-mobile"></i> +48 100 200 300 </div> </div>'
var styles = [{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]}];
var image = "/media/img/marker.png";
var title = 'Map marker';
var polygons = [];
var markers = [];
var map = null;
var infoWindow;
var coords = [
    { lat: 52.121, lng: 21.207 },
    { lat: 52.221, lng: 21.207 },
    { lat: 52.221, lng: 21.407 },
    { lat: 52.121, lng: 21.407 }, // north east
];
var coords1 = [
	{lat:52.197,lng:21.272},
	{lat:52.160,lng:21.272},
	{lat:52.160,lng:21.332},
	{lat:52.197,lng:21.332},
];

function Map1(div)
{
	let map_div = document.getElementById(div)
	if(!map_div) {
		console.log("Error map div", div)
		return;
	}
	console.log('Map loading ...')

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

	// Marker on click
	MarkerOnClick(map, Icon(image,60,60),'Map marker', info)

	// Load polygon
	MultiPolygon(map, [coords, coords1], '#ff6600','Polygon Title', info)

	// Draw polygon and catch event with calback function
	DrawPolygon(map, '#cc55cc', EditPolygonCallback)
	MultiPolygonInfo(map)
}

/* Events */

window.addEventListener('load', (ev) => {
	// Load map
	Map1("map")

});