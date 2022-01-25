let map, draw;
let point = { lat: 52.155, lng: 21.034 };
let poly = [{"lat":52.12110974911002,"lng":21.091286765281204},{"lat":52.17040924996226,"lng":21.04047499770308},{"lat":52.19251308311206,"lng":21.04768477553511},{"lat":52.190829368155896,"lng":21.082703696433548},{"lat":52.155877891664815,"lng":21.124245749656204},{"lat":52.13249140154469,"lng":21.150681601706985}]

function initMap()
{
	// Map
	map = new google.maps.Map(document.getElementById("map"),  {
		center: point,
		zoom: 11,
		draggable: true,
		zoomControl: true,
		scrollwheel: true,
		disableDoubleClickZoom: true,
	});

	// Load bg polygon	
	DrawPoly()

	// Enable draw button
	draw = new google.maps.Data({map: map});
	draw.setControls(['Polygon'])
	draw.setDrawingMode("Polygon")
	draw.setStyle({
		editable: true,
		draggable: true,
		strokeColor: "#12bc00",
		fillColor: "#12bc00",
		strokeOpacity: 0.7,
		strokeWeight: 2,
		fillOpacity: 0.5,
		zIndex: 0
	});

	// Create
	draw.addListener('addfeature', function(e) {
		updatePolygon(e)
		draw.forEach((p) => {
			if(p != e.feature) {
				draw.remove(p);
			}
		})
	});

	// Drag
	draw.addListener('dragend', function(e) {
		updatePolygon(e)
	})

	// Edit
	draw.addListener('setgeometry', function(e) {
		updatePolygon(e)
	})

	// Delete
	draw.addListener('rightclick', function(e) {
		draw.remove(e.feature);
	})
}

// Mysql geoJson
function updatePolygon(e)
{
	let GeoJSON = {"type": "Polygon", "coordinates": []}
	let obj = e.feature.getGeometry()
	let arr = []

	obj.forEachLatLng((p) => {
		arr.push([p.lng(), p.lat()])
		console.log("Point" , p)
	})
	arr.push(arr[0])
	GeoJSON.coordinates.push(arr);

	let el = document.getElementById("polygon")
	el.value = JSON.stringify(GeoJSON)

	// console.log("Polygon", GeoJSON)
}

function Polygon(coordinates, color = '#fff', title = '', info = '')
{
	let p = new google.maps.Polygon({
		paths: coordinates,
		strokeColor: color,
		fillColor: color,
		strokeOpacity: 0.7,
		strokeWeight: 1,
		fillOpacity: 0.3,
		zIndex: 0,
		info: info,
		title: title
	});
	p.setMap(map)
	return p
}

// Draw from textarea
function DrawPoly() {
	let el = document.querySelector(".polygon-edit")
	if(el) {
		let json = JSON.parse(el.value)
		let arr = json.coordinates
		let gmap_poly = []
		if(arr[0]) {
			arr[0].forEach((i) => {
				gmap_poly.push({"lng":i[0], "lat":i[1]})
			})
			Polygon(gmap_poly)
		}
	}
}

/*
<style>
#map {
	float: left;
	width: 100%;
	height: 450px;
	background: #fafafa;
}
</style>

<div id="map"></div>
<textarea name="polygon" id="polygon" class="polygon-edit">{mysql_json_textarea}</textarea>

<script src="https://maps.googleapis.com/maps/api/js?key=&libraries=drawing,geometry&callback=initMap" async></script>

let mysql_json_textarea = {"type":"Polygon","coordinates":[[[21.03674658203124,52.20804911717869],[21.1610294189453,52.094294932468785],[20.9028507080078,52.094294932468785],[21.03674658203124,52.20804911717869]]]}

let geo = {type: 'Feature',geometry: {type: 'Polygon',coordinates: []},properties: {}};
*/
