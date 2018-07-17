<?php
/**
 * Сутність користувач
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Entity;

use MediaCMS\Panel\Entity;
use MediaCMS\Panel\Exception\Entity as EntityException;

class Role extends Entity {

    /** @var array Властивості сутності ролі */
    protected $__properties = [

        'title'         => ['type' => 'string16'],
        'description'   => ['type' => 'string128'],
    ];
}