 $(document).ready(function(){
 	$("#address_search").hide();

 	var rectangleDrawer = new L.Draw.Rectangle(map);

 	var polygonDrawer = new L.Draw.Polygon(map);

 	$("#rectangle_filter").click(function(){
 		rectangleDrawer.enable();
 	});

 	$("#polygon_filter").click(function(){
 		polygonDrawer.enable();
 	});

 	map.on('draw:created', function (e){
 		var type = e.layerType;
 		var layer = e.layer;
 		if(type === 'rectangle' || 'polygon'){
 			var coords = layer.getLatLngs()[0];
 			var polyStringParse = coords.toString().replace(/[^ \d,.-]/g, '');
 			var regExpPattern = /([^,]+[^,]),([^,]+[^,])/g;
 			var polyCQL = polyStringParse.replace(regExpPattern, '$2 $1');
 			var polyCQLArray = polyStringParse.split(',')

 			var polyurl = ocation.protocol + "18.221.74.167:8080/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=postgresql:addresses&outputFormat=application/json&format_options=callback:getJson&SrsName=EPSG:4326&cql_filter=INTERSECTS(geom, POLYGON((" + polyCQL + ', ' + polyCQLArray[1] + ' ' + polyCQLArray[0] + ")))"; var download_url = "http://localhost:8080/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=policy:rclt_sv_allpersonal&outputFormat=csv&format_options=callback:getJson&SrsName=EPSG:4326&cql_filter=INTERSECTS(geom, POLYGON((" + polyCQL + ', ' + polyCQLArray[1] + ' ' + polyCQLArray[0] + ")))";

			$.ajax({url: polyurl,
 				success: function(result){
 					var total = result.totalFeatures;
 					var total_amount = result.features;
 					var building_total = 0;
 					for (i = 0; i < total_amount.length; i++) {
 						building_total += total_amount[i]['properties']['value'];
 					} 
 					var building_total = building_total | 0;
 					document.getElementById("total_affected").innerHTML = total.toLocaleString()
 					document.getElementById("total_loss").innerHTML = building_total.toLocaleString()
 				}});

 		}
 	});
 }); 




 var map = L.map('map').setView([40.487429, -88.995913], 13);

 var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
 	maxZoom: 18,
 	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
 	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
 	'Imagery © <a href="http://mapbox.com">Mapbox</a>',
 	id: 'mapbox.streets'
 }).addTo(map);

 var Imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
 	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
 });

 var counties = L.tileLayer.wms('http://18.221.74.167:8080/geoserver/ows?', {
 	layers: 'postgresql:counties',
 	transparent: true,
 	format: 'image/png'
 });

 var addresses = L.tileLayer.wms('http://18.221.74.167:8080/geoserver/ows?', {
 	layers: 'postgresql:addresses',
 	transparent: true,
 	format: 'image/png'
 }).addTo(map);

 var weather_radar = L.esri.dynamicMapLayer({
 	url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer',
 	opacity: 0.7
 });

 var lightning = L.esri.dynamicMapLayer({
 	url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/sat_meteo_emulated_imagery_lightningstrikedensity_goes_time/MapServer',
 	opacity: 0.7
 });
 var precip = L.esri.dynamicMapLayer({
 	url: 'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/analysis_meteohydro_sfc_qpe_time/MapServer',
 	opacity: 0.5,
 	layers: ['24'],
 });


 var baseMaps = {
 	"Streets": streets,
 	"Imagery": Imagery
 };

 var overlayMaps = {
 	"Addresses": addresses,
 	"Counties": counties, 	
 	"Weather Radar": weather_radar,
 	"Lightning": lightning,
 	"72 Hour Rainfall": precip
 };

 var editableLayers = new L.FeatureGroup();
 map.addLayer(editableLayers);

 var options = {
 	position: 'topright',
 	draw: {
 		polyline: {
 			shapeOptions: {
 				color: '#f357a1',
 				weight: 10
 			}
 		},
 		polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions: {
                	color: '#bada55'
                }
            },
            circle: false, // Turns off this drawing tool
            rectangle: {
            	shapeOptions: {
            		clickable: false
            	}
            },
        },
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: false
        }
    };

    var layerControl = L.control.layers(baseMaps, overlayMaps,{collapsed:false}).addTo(map);

    var drawControl = new L.Control.Draw(options);
