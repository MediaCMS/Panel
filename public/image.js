console.log('image.js loaded');
function Image(host, debug = false) {
    let properties = {
        url: host + '?action=',
        callbacks: {done: null, fail: null, always: null, then: null}
    };
    let setError = function(error) {
        if (debug) console.log('Помилка: ' + error);
        if(properties.callbacks.fail != null)
            properties.callbacks.fail(error);
    };
    let addListener = function(callbacks) {
        //if (debug) console.log(callbacks);
        $.each(callbacks, function(handler, callback) {
            if (typeof properties.callbacks[handler] == 'undefined') {
                setError('Невідомий метод зворотнього виклику ' + handler);
                return false;
            }
            properties.callbacks[handler]=callback;
        });
    };
    this.upload = function(image, callbacks){
        let params = {method: 'POST', processData: false, contentType: false};
        params.url = properties.url + 'upload';
        params.data = new FormData();
        params.data.set('image', image);
        addListener(callbacks);
        doRequest(params);
    };
    this.remove = function(uri, callbacks){
        let params = {method: 'POST', data: {uri: uri}};
        params.url = properties.url + 'remove';
        addListener(callbacks);
        doRequest(params);
    };
    let doRequest = function(params){
        if (debug) params.url += '&debug=1';
        if (debug) console.log(params);
        $.ajax(params)
        .done(function(responce){
            console.log('image.request.done');
            if (debug) console.log(responce);
            if(responce.length === 0){
                setError('Відсутня відповідь сервера зображень');
                return false;
            }
            if(typeof responce !== 'object'){
                setError('Відповідь сервера неправильного типу (' + typeof responce + ')');
                return false;
            }
            if(responce.debug !== undefined) console.log({debug: responce.debug});
            if(responce.status !== 1) {
                let error = responce.error.message;
                if(responce.error.code !== undefined) error += ' [' + responce.error.code + ']';
                if(responce.trace !== undefined) console.log({trace: responce.trace});
                setError(error);
                return false;
            }
            if(properties.callbacks.done != null)
                properties.callbacks.done(responce);
        })
        .fail(function() {
            setError('Помилка запиту до сервера зображення');
        })
        .always(function() {
            if(properties.callbacks.always != null)
                properties.callbacks.always();
        })
        .then(function () {
            if(properties.callbacks.then != null)
                properties.callbacks.then();
        });
    }
}