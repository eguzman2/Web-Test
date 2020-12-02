// api_url = 'http://localhost:5000'; // local
api_url = 'https://searching-service-api.herokuapp.com';


function alertError(message) {
    string_alert = "<div class='alert alert-danger'><span>" + 
    message + "</span><button type='button' class='close'>&times;</button></div>"
    $('#alert-div-container').append(string_alert)
}

function getUrlImage(type) {
    if(type == 'itunes'){
        return 'images/itunes.png'
    }else if (type == 'tvmaze'){
        return 'images/tvmaze.png'
    } else {
        return 'images/itunes.png'
    }
}

function addResult(name, url, type, source, details) {
    url_image = getUrlImage(source)
    string_result = '<div class="widget widget-table">' +
                        '<div class="widget-header">' +
                            '<h3>'+name+'</h3>' +
                        '</div>'+
                        '<div class="widget-content">'+
                            '<div class="row">'+
                               '<div class="col-lg-1 col-md-2 col-sm-3 col-xs-3">'+
                                    '<div class="row">'+
                                        '<div class="image-result">'+
                                            '<img src="'+url_image+'" class="img-circle image-type">'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="row" style="text-align: center;">'+
                                        '<a href="'+url+'">Ver</a>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="col-lg-11 col-md-10 col-sm-9 col-xs-9">'+
                                '<div class="label label-info">'+type+'</div> </br></br>';
    for (var key in details) {
        if (details.hasOwnProperty(key)) {   
            string_result = string_result + '<strong>'+key+':</strong> '+details[key]+'</br>';     
        }
    }
    string_result = string_result + '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

    $('#results-container').append(string_result);
}

function clearResults() {
    $('#results-container').html('');    
}

function search() {
    clearResults();
    var search_text = $("#search_input").val();

    if(search_text == undefined || search_text == ''){
        return false;
    }

    var request_data = {
        'term': search_text
    };

    var body = JSON.stringify(request_data)
    fetch(api_url + '/search', {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .catch(err => {
        console.error('Error:', err)
        alertError('<strong>A ocurrido un error al conectar con el servidor.</strong> Contacte a soporte tecnico.')

    })
    .then(response => {
        console.log(response);
        if(response.error){
            alertError('Sin resultados :(')
        } else{
            if (response.ok){
                for (let c = 0; c < response.results.length; c++) {
                    const element = response.results[c]
                    addResult(element.name, element.url, element.type, 
                        element.source, element.details)
                }
            }else{
                for(let c=0; c<response.errors.length; c++){
                    alertError(response.errors[c].message)
                }
            }
        }
    })
}