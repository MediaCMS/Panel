/**
 * Головний JS файл
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

$(function(){

    console.log('document ready');

    let nodes = {};
    nodes.body = $('body');

    $('main table.clickable').on('click', 'tbody tr', function() {
        window.location.href = $(this).data('edit');
    });

    nodes.autocomplete =$('main div.autocomplete');
    if (nodes.autocomplete.length > 0) {
        nodes.autocomplete.on('keyup', 'input', function() {
            console.log($(this));
            autocompleteInput = $(this);
            nodes.autocomplete.find('div.autocomplete-list').remove();
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
                    autocompleteInput.parent().after(autocompleteList);
                    nodes.body.on('click', function () {
                        nodes.autocomplete.find('div.autocomplete-list').remove();
                    })
                },
                'fail': function (jqXHR) {
                    console.log('request.fail');
                    if (!!jqXHR && (jqXHR !== undefined)) console.log(jqXHR);
                }
            })
        }).on('change', function() {
            console.log('request.change');
        });
        nodes.autocomplete.on('click', 'div.autocomplete-list ul li', function() {
            console.log($(this).data('id') + '->' + $(this).text());
            let tag = $('<button type="button" class="btn btn-outline-secondary" />').text($(this).text());
            tag.append($('<input type="hidden" name="tag[]" />').val($(this).data('id')));
            console.log(tag.prop('outerHTML'));
            autocompleteSelected = nodes.autocomplete.find('div.autocomplete-selected');
            if (autocompleteSelected.length === 0) {
                autocompleteSelected = $('<div class="autocomplete-selected" />');
                nodes.autocomplete.append(autocompleteSelected);
            }
            autocompleteSelected.append(tag);
        });
        nodes.autocomplete.on('click', 'div.autocomplete-selected button', function() {
            autocompleteSelected = $(this).parent();
            $(this).remove();
            if (autocompleteSelected.find('button').length === 0)
                autocompleteSelected.remove();
        });
    }
});


function request(uri, data, callbacks) {
    let params = {method: 'GET',
        text: 'text', dataType: 'json', cache: false, timeout: 3000};
    if (!!data && (data !== undefined)) params.data = data;
    console.log(params);
    try {
        $.ajax(uri, params)
        .done(function(response) {
            console.log(response);
            if(response.length === 0)
                throw new Error('Відсутня відповідь сервера');
            if(typeof response !== 'object')
                throw new Error('Відповідь сервера неправильного типу ('+typeof response+')');
            if(response.debug !== undefined)
                console.log({debug:response.debug});
            if(response.exception !== undefined) {
                console.log({exception:response.exception});
                throw new Error(response.exception.message);
            }
            let data = (response.data !== undefined) ? response.data : null;
            if (!!callbacks && !!callbacks.done) callbacks.done(data);
        })
        .fail(function(jqXHR) {
            if (!!callbacks && !!callbacks.fail) callbacks.fail(jqXHR);
        });
    } catch(e) {
        alert(e.message+': '+e.name);
        if (!!callbacks && !!callbacks.fail) callbacks.fail();
    }
}