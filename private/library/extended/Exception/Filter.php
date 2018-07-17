<?php
/**
 * Виняток для фільтра
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Exception;

use MediaCMS\Panel\Exception;

class Filter extends Exception {

    /** @var string Текст винятка */
    protected $message = 'Виняток фільтра';

}