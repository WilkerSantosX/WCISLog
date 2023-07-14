var dataChegada;
var dataSaida;


function GetDefault(){
    let dataformat = $("#data_chegada").val().split("/");  
    $("#permanencia_id").val(moment(dataformat[2] + dataformat[1] + dataformat[0], "YYYYMMDD").fromNow());
}

function GetTimerFromDate() {
    let dataformat = $("#data_chegada").val().split("/");   
    $("#permanencia_id").val(moment(dataformat[2] + dataformat[1] + dataformat[0], "YYYYMMDD").fromNow());
}

function GetTimerFromHour(type){
    if(type == "chegada"){
        let dformat = $("#data_chegada").val().split("/");
        let hformat = $("#hora_chegada").val();
    
        let chegadaHora = dformat[2] + "-" + dformat[1] + "-" + dformat[0] + " " + hformat;
        dataChegada = moment(chegadaHora, 'YYYY-MM-DD HH:mm:ss');
        //var dataChegada = moment('2023-07-12 19:29:23', 'YYYY-MM-DD HH:mm:ss');

    }
    else if(type == "saida"){
        let dformat = $("#data_saida").val().split("/");
        let hformat = $("#hora_saida").val();
    
        let saidaHora = dformat[2] + "-" + dformat[1] + "-" + dformat[0] + " " + hformat;
        dataSaida = moment(saidaHora, 'YYYY-MM-DD HH:mm:ss');
        //var dataSaida = moment('2023-07-12 19:29:23', 'YYYY-MM-DD HH:mm:ss');
    
        CalcularPermanencia();
    }
}

function CalcularPermanencia(){    
    let duration = moment.duration(dataSaida.diff(dataChegada));
    let hours = parseInt(duration.asHours());
    let minutes = parseInt(duration.asMinutes())-hours*60;
    $("#permanencia_id").val(hours + ' hour(s) and '+ minutes+' minutes.');
}


function UploadRota(){
    if(document.getElementById('upload-csv').files[0] === undefined){
        return alert('Clique no botão "File" e insira um arquivo csv!');
    }
    
    $('.modal').modal('close');

    Papa.parse(document.getElementById('upload-csv').files[0], {
        download: true,
        header: true,
        complete: function(results) {
            //console.log(results);

            var path = new Array;
            var pathCircle = L.layerGroup();
            var circle;
            var rota;

            for (var i = 0; i < 1; i++) {              
                $("#codigo_id").val(results.data[i].Codigo); 
                $("#notas_id").val(results.data[i].NFs);

                $("#destino_id").val(results.data[i].Destino);
                let geoDestino = results.data[i].DestinoGeo.split(",");
                L.marker(geoDestino, { icon: idestino }).addTo(map).bindPopup("Destino");

                $("#motorista_id").val(results.data[i].Motorista);

                $("#origem_id").val(results.data[i].Origem);
                let geoOrigem = results.data[i].OrigemGeo.split(",");
                L.marker(geoOrigem, { icon: iorigem }).addTo(map).bindPopup("Origem");

                $("#previsao_entrega_id").val(results.data[i].PrevisaoEntrega);
                $("#previsao_inicio_id").val(results.data[i].PrevisaoInicio);

                let posicoes = results.data[i].Track.split("]");
                let _ultimaPosicao;
                let _UltimaPosicaoDetalhe;

                $.each(posicoes, function (i, item) {
                    //console.log(item);
                    if(!item)
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

