var dataChegada;
var dataSaida;

function GetDefault() {
    let dataformat = $("#data_chegada").val().split("/");
    $("#permanencia_id").val(moment(dataformat[2] + dataformat[1] + dataformat[0], "YYYYMMDD").fromNow());
}

function GetTimerFromDate() {
    let dataformat = $("#data_chegada").val().split("/");
    $("#permanencia_id").val(moment(dataformat[2] + dataformat[1] + dataformat[0], "YYYYMMDD").fromNow());
}

function GetTimerFromHour(type) {
    if (type == "chegada") {
        let dformat = $("#data_chegada").val().split("/");
        let hformat = $("#hora_chegada").val();

        let chegadaHora = dformat[2] + "-" + dformat[1] + "-" + dformat[0] + " " + hformat;
        dataChegada = moment(chegadaHora, 'YYYY-MM-DD HH:mm:ss');
        //var dataChegada = moment('2023-07-12 19:29:23', 'YYYY-MM-DD HH:mm:ss');

    }
    else if (type == "saida") {
        let dformat = $("#data_saida").val().split("/");
        let hformat = $("#hora_saida").val();

        let saidaHora = dformat[2] + "-" + dformat[1] + "-" + dformat[0] + " " + hformat;
        dataSaida = moment(saidaHora, 'YYYY-MM-DD HH:mm:ss');
        //var dataSaida = moment('2023-07-12 19:29:23', 'YYYY-MM-DD HH:mm:ss');

        CalcularPermanencia();
    }
}

function CalcularPermanencia() {
    let duration = moment.duration(dataSaida.diff(dataChegada));
    let hours = parseInt(duration.asHours());
    let minutes = parseInt(duration.asMinutes()) - hours * 60;
    $("#permanencia_id").val(hours + ' hour(s) and ' + minutes + ' minutes.');
}


function UploadRota() {
    if (document.getElementById('upload-csv').files[0] === undefined) {
        return alert('Clique no botão "File" e insira um arquivo csv!');
    }

    $('.modal').modal('close');

    Papa.parse(document.getElementById('upload-csv').files[0], {
        download: true,
        header: true,
        complete: function (results) {
            //console.log(results);

            var path = new Array;
            var pathCircle = L.layerGroup();
            var circle;
            var rota;

            for (var i = 0; i < 1; i++) {
                $("#codigo_id").val(results.data[i].Codigo);
                $("#notas_id").val(results.data[i].NFs);
                $("#origem_id").val(results.data[i].Origem);
                $("#destino_id").val(results.data[i].Destino);
                $("#motorista_id").val(results.data[i].Motorista);
                $("#previsao_entrega_id").val(results.data[i].PrevisaoEntrega);
                $("#previsao_inicio_id").val(results.data[i].PrevisaoInicio);

                //#region Origem  Marker, Circle e Polygon

                let geoOrigem = results.data[i].OrigemGeo.split(",");
                L.marker(geoOrigem, { icon: iorigem }).addTo(map).bindPopup("Origem"); //Marcador

                //Se tiver raio em torno da origem
                if (results.data[i].OrigemRaio &&
                    results.data[i].OrigemRaio.toLowerCase() != "null")
                    L.circle(geoOrigem, { radius: results.data[i].OrigemRaio }).addTo(map);  //Desenho do raio

                //Se tiver polígonos
                if (results.data[i].OrigemAreaPrincipal &&
                    results.data[i].OrigemAreaPrincipal.toLowerCase() != "null") {

                    var area = '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[';
                    var poligonoPai;

                    let patio = results.data[i].OrigemAreaPrincipal.split("]");

                    $.each(patio, function (i, item) {
                        if (!item)
                            return;

                        if (i == patio.length - 2)
                            area += item.replace("_", ",") + ']]]}}'
                        else
                            area += item.replace("_", ",") + '],'
                    });

                    var _data = JSON.parse(area);

                    poligonoPai = L.GeoJSON.geometryToLayer(_data).bindPopup('pátio principal');
                    poligonoPai.setStyle({ color: '#e0c74c', fillColor: '#d87700' });

                    poligonoPai.addTo(map); //Desenho do polígono
                }

                //Se tiver subpoligonos
                if (results.data[i].OrigemSubAreas &&
                    results.data[i].OrigemSubAreas.toLowerCase() != "null") {

                    var poligonosFilhos = new L.layerGroup();;
                    let subareas = [];
                    let patio = results.data[i].OrigemSubAreas.split("0_");

                    patio.forEach(function (item, indice, array) {
                        //console.log(item, indice, array);		                          
                        var area = '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[';
                        
                        if(!item || item == '')
                            return;

                        const _LatLng = replaceAll(item, "_", ",");
                        area += replaceAll(_LatLng, "]", "],").slice(0, -1) + ']]}}';
                        subareas.push(area);
                    });

                    //console.log(subareas);

                    subareas.forEach(function (item, indice, array) {
                        //console.log(item, indice, array);		  
                        var _data = JSON.parse(item);	
                        
                        poligonosFilhos.addLayer(
                            L.GeoJSON.geometryToLayer(_data, { color: '#009902', fillColor: '#64c465' }).bindPopup('sub-area Nº ' + indice)
                        );
                    });

                    poligonosFilhos.addTo(map);	
                }                


                //#endregion      

                //#region Destino Marker, Circle e Polygon

                let geoDestino = results.data[i].DestinoGeo.split(",");
                L.marker(geoDestino, { icon: idestino }).addTo(map).bindPopup("Destino"); //Marcador

                //Se tiver raio em torno do destino
                if (results.data[i].DestinoRaio &&
                    results.data[i].DestinoRaio.toLowerCase() != "null")
                    L.circle(geoDestino, { radius: results.data[i].DestinoRaio }).addTo(map); //Desenho do raio

                //Se tiver polígonos
                if (results.data[i].DestinoAreaPrincipal &&
                    results.data[i].DestinoAreaPrincipal.toLowerCase() != "null") {

                    var area = '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[';
                    var poligonoPai;
    
                    let patio = results.data[i].DestinoAreaPrincipal.split("]");
    
                    $.each(patio, function (i, item) {
                        if (!item)
                            return;
    
                        if (i == patio.length - 2)
                            area += item.replace("_", ",") + ']]]}}'
                        else
                            area += item.replace("_", ",") + '],'
                    });
    
                    var _data = JSON.parse(area);
    
                    poligonoPai = L.GeoJSON.geometryToLayer(_data).bindPopup('pátio principal');
                    poligonoPai.setStyle({ color: '#e0c74c', fillColor: '#d87700' });
    
                    poligonoPai.addTo(map); //Desenho do polígono
                }


                if (results.data[i].DestinoSubAreas &&
                    results.data[i].DestinoSubAreas.toLowerCase() != "null") {

                    var poligonosFilhos = new L.layerGroup();;
                    let subareas = [];
                    let patio = results.data[i].DestinoSubAreas.split("0_");

                    patio.forEach(function (item, indice, array) {
                        //console.log(item, indice, array);		                          
                        var area = '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[';
                        
                        if(!item || item == '')
                            return;

                        const _LatLng = replaceAll(item, "_", ",");
                        area += replaceAll(_LatLng, "]", "],").slice(0, -1) + ']]}}';
                        subareas.push(area);
                    });

                    //console.log(subareas);

                    subareas.forEach(function (item, indice, array) {
                        //console.log(item, indice, array);		  
                        var _data = JSON.parse(item);	
                        
                        poligonosFilhos.addLayer(
                            L.GeoJSON.geometryToLayer(_data, { color: '#009902', fillColor: '#64c465' }).bindPopup('sub-area Nº ' + indice)
                        );
                    });

                    poligonosFilhos.addTo(map);	
                }

                //#endregion

                //#region Posições Polyline e Rota

                let posicoes = results.data[i].Track.split("]");
                let _ultimaPosicao;
                let _UltimaPosicaoDetalhe;

                $.each(posicoes, function (i, item) {
                    //console.log(item);
                    if (!item)
                        return;

                    let geoPosicao = item.substring(1).split("_");
                    let LatLng = geoPosicao[1].split(",");
                    _ultimaPosicao = LatLng;
                    _UltimaPosicaoDetalhe = geoPosicao[0];
                    path.push(LatLng);

                    circle = L.circleMarker(LatLng, {
                        color: "#7c7c7c",
                        fillColor: "#fff",
                        fillOpacity: 1,
                        weight: 1,
                        radius: 5.0
                    }).bindPopup(geoPosicao[0]);
                    circle.addTo(pathCircle);
                });

                rota = L.polyline(path, {
                    stroke: true,
                    color: 'red',
                }).addTo(map);

                pathCircle.addTo(map);

                L.marker(_ultimaPosicao, { icon: iveiculo })
                    .addTo(map)
                    .bindPopup("Ultima Localização:" + _UltimaPosicaoDetalhe);

                map.setView(_ultimaPosicao, 13);

                //console.log(results.data[i].Track);
                $("#veiculo_id").val(results.data[i].Veiculo);

                //#endregion
            }

            M.updateTextFields();

            // RemoveLayersMap();

            // // let posicoes = [
            // //     {
            // //         "Lat": -23.591218003500877,
            // //         "Lng": -46.905192189876566,
            // //     },
            // //     {
            // //         "Lat": -23.591522800216804,
            // //         "Lng": -46.90131908037364,
            // //     },
            // //     {
            // //         "Lat": -23.595072154997386,
            // //         "Lng": -46.90041785821783,
            // //     },
            // // ];

            // // $.each(posicoes, function (i, item) {
            // //     path.push([item.Lat, item.Lng]);

            // //     circle = L.circleMarker([item.Lat, item.Lng], {
            // //         color: "#7c7c7c",
            // //         fillColor: "#fff",
            // //         fillOpacity: 1,
            // //         weight: 1,
            // //         radius: 5.0
            // //     }).bindPopup('oi');
            // //     circle.addTo(pathCircle);
            // // });

            // // rota = L.polyline(path, {
            // //     stroke: true,
            // //     color: 'red',
            // // }).addTo(map);

            // // pathCircle.addTo(map);


            // var path = new Array;
            // var pathCircle = L.layerGroup();
            // var circle;
            // var rota;

            // let _ultimaPosicao = results.data[results.data.length - 3];        
            // map.setView([_ultimaPosicao.Lat, _ultimaPosicao.Lng], 10);

            // for (var i = 0; i < results.data.length; i++) {
            //     var obj = new Object();
            //     obj.latitude = results.data[i].Lat;
            //     obj.longitude = results.data[i].Lng;
            //     obj.row = results.data[i].Row;
            //     obj.DataPosicao = results.data[i].DataPosicao;

            //     if(obj.latitude === undefined)
            //         continue;

            //     if(obj.latitude == "" || obj.longitude == "" || obj.latitude.includes("..") || obj.longitude.includes(".."))
            //     {
            //         console.log("Linha: " + obj.row + " - LatLong inválida!");
            //     }
            //     else{                    
            //         path.push([obj.latitude, obj.longitude]);

            //         circle = L.circleMarker([obj.latitude, obj.longitude], {
            //             color: "#7c7c7c",
            //             fillColor: "#fff",
            //             fillOpacity: 1,
            //             weight: 1,
            //             radius: 5.0
            //         }).bindPopup('<h6>Data Posição: <br/>' + obj.DataPosicao + '</h6>');
            //         circle.addTo(pathCircle);        
            //     }
            // }

            // rota = L.polyline(path, {
            //     stroke: true,
            //     color: 'red',
            // }).addTo(map);

            // pathCircle.addTo(map);
        }
    });
};


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

