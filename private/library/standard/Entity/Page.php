<?php
/**
 * Сутність статична сторінка
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Entity;

use MediaCMS\Panel\Entity;

class Page extends Entity {

    /** @var array Властивості сутності сторінки */
    protected $__properties = [

        'time'          => ['type' => 'datetime'],
        'title'         => ['type' => 'string32'],
        'description'   => ['type' => 'string128'],
        'text'          => ['type' => 'text4k'],
        'image'         => ['type' => 'hash32'],
        'userID'        => ['type' => 'unsigned1'],
        'userTitle'     => ['type' => 'string32'],
    ];
}