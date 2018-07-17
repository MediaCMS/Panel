$(document).ready(function(){

    console.log('document ready');

    $('main table.clickable').on('click', 'tbody tr', function() {
        window.location.href = $(this).data('edit');
    });
});
