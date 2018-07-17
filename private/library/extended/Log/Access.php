<?php
/**
 * Робота з логом доступу
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel\Log\Access
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Log;

use MediaCMS\Panel\Log;

class Access extends Log {

    /** @var string Назва файлу лога */
    protected static $file = 'access.log';
}