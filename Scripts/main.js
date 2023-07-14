$(document).ready(function () {			
    
    $('.modal').modal();
    $('.tooltipped').tooltip();
    $('select').formSelect();

    $('.fixed-action-btn').floatingActionButton({
        direction: 'top',
          hoverEnabled: true
    });
    $('.timepicker').timepicker({
        twelveHour: false,
    });

    $('.datepicker').datepicker({
        format: "dd/mm/yyyy",
        defaultDate: moment().calendar(),
        i18n: {
            cancel: 'Cancelar',
            clear: 'Limpar',
            done: 'Ok',
            months: [ 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthsShort: [ 'Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
            weekdays: [ 'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado' ],
            weekdaysShort: [ 'Dom','Seg','Ter','Qua','Qui','Sex','Sáb' ],
            weekdaysAbbrev: [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ]
        },
    });


    $("#data_chegada").val(moment().format('DD/MM/yyyy'));
    $("#hora_chegada").val(moment().format('HH:mm:ss'));	

    $("#data_chegada").on('change', function () { GetTimerFromDate(); });
    $("#hora_chegada").on('change', function () { GetTimerFromHour("chegada"); });
    $("#data_saida").on('change', function () { });
    $("#hora_saida").on('change', function () { GetTimerFromHour("saida"); });


    //GetDefault();
    GetLocalyClient();
    M.updateTextFields();
});


function GetLocalyClient(){
    if (!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation feature!");
    } else {
        // setInterval(() => {
        // 	navigator.geolocation.getCurrentPosition(Main);
        // }, 5000)
        navigator.geolocation.getCurrentPosition(MainPosition);
    }
}