var map;
var infoOrigem = '<h6>local</h6>';
var marker, circle, poligonoPai;
var poligonosFilhos = new L.layerGroup();

var latLong;
var accuracy;

//Renderizar o ícone de origem
var iorigem = L.icon({
	iconUrl: 'Content/images/mapa/marker-origem.png',
	iconSize: [60, 60],
	iconAnchor: [30, 60],
	popupAnchor: [-3, -76]
});

var idestino = L.icon({
	iconUrl: 'Content/images/mapa/marker-destino.png',
	iconSize: [60, 60],
	iconAnchor: [30, 60],
	popupAnchor: [-3, -76]
});	

var iveiculo = L.icon({
	iconUrl: 'Content/images/mapa/marker-truck.png',
	iconSize: [60, 60],
	iconAnchor: [30, 60],
	popupAnchor: [-3, -76]
});	

function IniciarMapa(){	
	//Set visão do mapa
	map = L.map('map').setView([-23.550519562779346, -46.63364131951546], 16);
		
		//Instanciando o mapa via jquery e renderizando no HTML
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 4,   //Valor do scroll no zoom
		maxZoom: 19,  //Valor do scroll no zoom
		attribution: '© StreetMap'
	}).addTo(map);	
	
	//L.marker([-12.7900,-38.47283], { icon: iorigem }).addTo(map).bindPopup(infoOrigem);
	// marker = L.marker([-12.7900,-38.47283], { icon: iorigem }).bindPopup(infoOrigem);		
	// L.featureGroup([marker]).addTo(map);
	
	//Desenhar a área do poligono		
	// let area = '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-38.47783,-12.791714],[-38.477036,-12.791641],[-38.474064,-12.791442],[-38.472712,-12.791515],[-38.471796,-12.791737],[-38.471367,-12.791413],[-38.471678,-12.790649],[-38.472343,-12.789634],[-38.472483,-12.78909],[-38.473094,-12.788797],[-38.474028,-12.78888],[-38.474575,-12.788409],[-38.474908,-12.788315],[-38.475037,-12.788818],[-38.475004,-12.790387],[-38.475455,-12.790544],[-38.475552,-12.791067],[-38.476377,-12.791289],[-38.476173,-12.790766],[-38.476366,-12.790002],[-38.476688,-12.789887],[-38.477096,-12.790368],[-38.477289,-12.790985],[-38.477675,-12.791174],[-38.478115,-12.791561],[-38.47783,-12.791714]]]}}'			
	// var _data = JSON.parse(area);
    // poligonoPai = L.GeoJSON.geometryToLayer(_data).bindPopup('pátio principal');
    // poligonoPai.setStyle({ color: '#e0c74c', fillColor: '#d87700' });

    // poligonoPai.addTo(map);		
				
	// //Desenhar área do subpolígono
	// let subareas = [];
	// subareas.push('{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-38.4773,-12.791078],[-38.476624,-12.790176],[-38.476455,-12.790194],[-38.476302,-12.790704],[-38.476742,-12.791343],[-38.4773,-12.791078]]]}}');
	// subareas.push('{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-38.477887,-12.791677],[-38.477828,-12.791594],[-38.477731,-12.791696],[-38.477828,-12.791706],[-38.477887,-12.791677]]]}}');
	// subareas.push('{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-38.475376,-12.791392],[-38.475352,-12.79151],[-38.475081,-12.791452],[-38.475124,-12.79134],[-38.475376,-12.791392]]]}}');
	// subareas.push('{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-38.472345,-12.790508],[-38.472372,-12.789901],[-38.47252,-12.789886],[-38.472514,-12.790506],[-38.472345,-12.790508]]]}}');
	// subareas.push('{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-38.472343,-12.789901],[-38.4723,-12.790503],[-38.471919,-12.79049],[-38.472343,-12.789901]]]}}');
				
	// subareas.forEach(function (item, indice, array) {
	// 	//console.log(item, indice, array);		  
	// 	var _data2 = JSON.parse(item);	
		
	// 	poligonosFilhos.addLayer(
	// 		L.GeoJSON.geometryToLayer(_data2, { color: '#009902', fillColor: '#64c465' }).bindPopup('sub-area Nº ' + indice)
	// 	);

	// 	// var subpatio = L.GeoJSON.geometryToLayer(_data2).bindPopup('sub-area Nº ' + indice);
	// 	// subpatio.setStyle({ color: '#009902', fillColor: '#64c465' });
	// 	// subpatio.addTo(map);
		
	// 	// poligonosFilhos.addLayer(subpatio);
	// });

	// poligonosFilhos.addTo(map);	
}

function MainPosition(position){
    //console.log(position);   
	//latLong = $("#coordenadas_id").val().split(",");
	RemoveLayersMap();
	
	var lat = position.coords.latitude;
    var long = position.coords.longitude;
    accuracy = position.coords.accuracy;

	//map.setView([lat, long], 16);

    marker = L.marker([lat, long]).bindPopup('Seu local');
	//circle = L.circle([lat, long], {radius: accuracy});

	var featureGroup = L.featureGroup([marker]).addTo(map);
	map.fitBounds(featureGroup.getBounds());

	//ImprimirCoordenadas(lat + "," + long);
	//$("#metros_id").val(accuracy);
	
	// marker = L.marker([lat, long], { icon: iorigem });
	// marker.addTo(map);

	// circle = L.circle([lat, long], {radius: accuracy});
	// circle.addTo(map);
}

function ReposicionarMapa(){		
	latLong = $("#coordenadas_id").val().split(",");

	RemoveLayersMap();

	map.setView(latLong, 16);	

	L.marker(latLong, { icon: iorigem }).addTo(map).bindPopup(infoOrigem);
	L.circle(latLong, {radius: accuracy}).addTo(map);

	//Renderiza no mapa um circulo no local da coordenada
	// var circle = L.circle($("#coordenadas_id").val().split(","), {
	// 	color: 'red',
	// 	fillColor: '#f03',
	// 	fillOpacity: 0.5,
	// 	radius: $("#area_desenho").val()
	// }).addTo(map);
}

function RemoveLayersMap(){
	if(marker){
		map.removeLayer(marker);
	}
	if(circle){
		map.removeLayer(circle);
	}
	if(poligonoPai){
		map.removeLayer(poligonoPai);
	}	
	if(poligonosFilhos){
		map.removeLayer(poligonosFilhos);
	}
}

function ImprimirCoordenadas(texto){
	$("#coordenadas_id").val(texto);
	M.updateTextFields();
	latLong = $("#coordenadas_id").val().split(",");
}

function ChangeDrawAccuracy(isSelected){
	//console.log($("#desenho_id").val());
	accuracy = $("#metros_id").val();

	if(isSelected){
		if($("#desenho_id").val() != "Raio"){
			if(circle){
				map.removeLayer(circle);
			}
		} else if($("#desenho_id").val() == "Raio"){
			circle = L.circle(latLong, {radius: accuracy});
			circle.addTo(map);
		}
	} else {
		map.removeLayer(circle);
		circle = L.circle(latLong, {radius: accuracy});
		circle.addTo(map);		
	}	
}

