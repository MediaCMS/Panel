<?php
/**
 * Клас для винятків
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel;

class Exception extends \Exception {

    /** @var string xdebug_message */
    public $xdebug_message;
}