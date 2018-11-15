/**
 * Головний JS файл
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

$(document).ready(function(){

    console.log('document ready');

    let nodes = {};
    nodes.body = $('body');

    $('main table.clickable').on('click', 'tbody tr', function() {
        window.location.href = $(this).data('edit');
    });

    let nodesAutocomplete =$('main div.autocomplete');
    if (nodesAutocomplete.length > 0) {
        nodesAutocomplete.on('keyup', 'input', function() {
            console.log($(this));
            let nodeAutocomplete = $(this).parent().parent();
            let nodeAutocompleteInput = $(this);
            nodeAutocomplete.find('div.autocomplete-list').remove();
            request($(this).data('api'), {title: $(this).val()}, {
                'done': function (data) {
                    console.log('request.done');
                    let autocompleteList = [];
                    if (Object.keys(data).length > 0) {
                        $.each(data, function (key, value) {
                            autocompleteList.push('<li data-id="' + value.id + '">' + value.title + '</li>');
                        });
                    }
                    autocompleteList = '<div class="autocomplete-list"><ul>'+autocompleteList.join('')+'</ul></div>';
                    nodeAutocompleteInput.parent().after(autocompleteList);
                    nodes.body.on('click', function () {
                        nodeAutocomplete.find('div.autocomplete-list').remove();
                    })
                },
                'fail': function (jqXHR) {
                    console.log('request.fail');
                    console.log(jqXHR);
                }
            })
        }).on('change', function() {
            console.log('request.change');
        });
    }
});


function request(uri, data, callbacks) {
    let params = {method: 'GET', url: uri, data: [],
        text: 'text', dataType: 'json', cache: false, timeout: 3000};
    if (!!data && (data !== undefined)) params.data = data;
    console.log(params);
    try {
        $.ajax(params)
        .done(function(responce) {
            console.log(responce);
            if(responce.length === 0)
                throw new Error('Відсутня відповідь сервера');
            if(typeof responce !== 'object')
                throw new Error('Відповідь сервера неправильного типу ('+typeof responce+')');
            if(responce.debug !== undefined)
                console.log({debug:responce.debug});
            if(responce.exception !== undefined) {
                console.log({exception:responce.exception});
                throw new Error(responce.exception.message);
            }
            let data = (responce.data !== undefined) ? responce.data : null;
            if (!!callbacks && !!callbacks.done) callbacks.done(data);
        })
        .fail(function(jqXHR) {
            if (!!callbacks && !!callbacks.fail) callbacks.fail(jqXHR);
        });
    } catch(e) {
        alert(e.message, e.name);
        if (!!callbacks && !!callbacks.fail) callbacks.fail(jqXHR);
    }
}