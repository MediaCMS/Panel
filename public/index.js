/**
 * Головний JS файл
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */
console.log('index.js loaded');
$(function(){

    console.log('document ready');

    let nodes = {};
    nodes.html = $('html');
    nodes.body = $('body');

    // index items clickable
    $('main table.clickable').on('click', 'tbody tr', function() {
        window.location.href = $(this).data('edit');
    });

   nodes.form = $('main form');
    if (nodes.form.length > 0) {
        let photoHost = nodes.html.data('photo-host');
        let photoPath = nodes.html.data('photo-path');
        let image = new Image(photoHost);
        // form wysiwyg
        nodes.wysiwyg = nodes.form.find('textarea.wysiwyg');
        if (nodes.wysiwyg.length > 0) {
            tinymce.init({
                selector: '.wysiwyg',
                schema: 'html5',
                language: 'uk_UA',
                min_height: 500,
                menubar: false,
                toolbar: 'bold italic underline strikethrough| copy paste cut | undo redo | forecolor backcolor | subscript superscript removeformat | link image charmap code',
                plugins: 'link image charmap code',
                images_upload_url: photoHost + '/upload.php',
                images_upload_base_path: photoHost + photoPath,
                images_upload_credentials: false,
                image_caption: true,
                image_dimensions: false,
                content_style: "img {max-width: 100%;}"
            });
        }



        // form image upload
        nodes.formImageUpload = nodes.form.find('#formImage');
        nodes.formImage = nodes.form.find('div.image');
        if (nodes.formImageUpload.length > 0) {
            nodes.formImageUpload.on('change', function() {
                console.log('form.image.upload.change');
                image.upload($(this)[0].files[0], {
                    done: function(response) {
                        console.log('form.image.upload.done');
                        let uri = photoHost + photoPath + response.uri;
                        nodes.formImageUpload.val('').addClass('d-none');
                        nodes.formImage.removeClass('d-none');
                        nodes.formImage.prepend('<img src="' + uri + '" alt="Головне зображення"/>');
                        nodes.formImage.find('input').attr('value', response.uri);
                    },
                    fail: function(error) { alert(error) }
                });
            });
        }
        // form image remove
        if (nodes.formImage.length > 0) {
            nodes.formImage.on('click', function() {
                console.log('form.image.remove.click');
                image.remove($(this).find('input').val(), {
                    done: function() {
                        console.log('form.image.remove.done');
                        nodes.formImage.addClass('d-none');
                        nodes.formImage.find('img').remove();
                        nodes.formImage.find('input').removeAttr('value');
                        nodes.formImage.parent().find('input:file').removeClass('d-none');
                    },
                    fail: function(error) { alert(error) }
                });
            });
            nodes.formImage.find('');
        }
    }

    // form autocomplete
    nodes.autocomplete = $('main div.autocomplete');
    if (nodes.autocomplete.length > 0) {
        nodes.autocomplete.on('keyup', 'input', function() {
            let exclude = [];
            let autocompleteInput = $(this);
            nodes.autocomplete.find('div.autocomplete-list').remove();
            nodes.autocomplete
                .find('div.autocomplete-selected button input')
                .each(function(){
                    exclude.push($(this).attr('name').match(/(\d)/)[0]);
                });
            request($(this).data('api'), {title: $(this).val(), exclude: exclude.join(',')}, {
                'done': function (data) {
                    //console.log('request.done');
                    let autocompleteList = [];
                    if (Object.keys(data).length > 0) {
                        $.each(data, function (key, value) {
                            autocompleteList.push('<li data-id="' + value.id + '">' + value.title + '</li>');
                        });
                    }
                    autocompleteList = '<div class="autocomplete-list"><ul>' + autocompleteList.join('') + '</ul></div>';
                    autocompleteInput.parent().after(autocompleteList);
                    nodes.body.on('click', function () {
                        nodes.autocomplete.find('div.autocomplete-list').remove();
                    })
                },
                'fail': function (jqXHR) {
                    console.log('request.fail');
                    if (!!jqXHR && (typeof jqXHR !== 'undefined')) console.log(jqXHR);
                }
            })
        }).on('change', function() {
            //console.log('request.change');
        });
        nodes.autocomplete.on('click', 'div.autocomplete-list ul li', function() {
            let tag = $('<button type="button" class="btn btn-outline-secondary" />').text($(this).text());
            tag.append($('<input type="hidden" />').val($(this).text())
                .attr('name', 'tags[' + $(this).data('id') + ']'));
            let autocompleteSelected = nodes.autocomplete.find('div.autocomplete-selected');
            if (autocompleteSelected.length === 0) {
                autocompleteSelected = $('<div class="autocomplete-selected" />');
                nodes.autocomplete.append(autocompleteSelected);
            }
            autocompleteSelected.append(tag);
        });
        nodes.autocomplete.on('click', 'div.autocomplete-selected button', function() {
            let autocompleteSelected = $(this).parent();
            $(this).remove();
            if (autocompleteSelected.find('button').length === 0)
                autocompleteSelected.remove();
        });
    }
});


function request(uri, data, callbacks) {
    let params = {method: 'GET',
        text: 'text', dataType: 'json', cache: false, timeout: 3000};
    params.data = data;
    //console.log(params);
    try {
        $.ajax(uri, params)
        .done(function(response) {
            //console.log(response);
            if(response.length === 0)
                throw new Error('Відсутня відповідь сервера');
            if(typeof response !== 'object')
                throw new Error('Відповідь сервера неправильного типу ('+typeof response+')');
            if(response.debug) console.log({debug:response.debug});
            if(response.exception) {
                console.log({exception:response.exception});
                throw new Error(response.exception.message);
            }
            let data = (response.data !== undefined) ? response.data : null;
            if (callbacks.done) callbacks.done(data);
            return false;
        })
        .fail(function(jqXHR) {
            if (callbacks.fail) callbacks.fail(jqXHR);
        })
        .always(function(){})
        .then(function(){});
    } catch(e) {
        alert(e.message+': '+e.name);
        if (callbacks.fail) callbacks.fail();
    }
}