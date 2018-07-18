<?php
/**
 * Робота з логом винятка
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel\Log\Exception
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Log;

use MediaCMS\Panel\Log;

class Exception extends Log {

    /** @var string Назва файлу лога */
    protected static $file = 'exceptions.log';
}