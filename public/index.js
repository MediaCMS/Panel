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

    $('main table.clickable').on('click', 'tbody tr', function() {
        window.location.href = $(this).data('edit');
    });
});
