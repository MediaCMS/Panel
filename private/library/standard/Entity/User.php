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

class User extends Entity {

    /** @var array Властивості сутності користувача */
    protected $__properties = [

        'time'          => ['type' => 'datetime'],
        'title'         => ['type' => 'string32'],
        'description'   => ['type' => 'string128'],
        'phone'         => ['type' => 'phone'],
        'skype'         => ['pattern' => '/^[.a-z0-9_-]{1,16}$/i'],
        'email'         => ['type' => 'email'],
        'password'      => ['pattern' => '/^[a-z0-9_-]{8,16}$/i'],
        'roleID'        => ['type' => 'unsigned1', 'value' => 3],
        'roleTitle'     => ['type' => 'string16'],
        'token'         => ['type' => 'hash32'],
        'image'         => ['type' => 'hash32']
    ];

    /**
     * Зберігає пароль користувача
     *
     * @param string|null $password Пароль
     */
    protected function setPassword(?string $password): void {

        if (strlen($password) == 0) return;

        $this->set('password', md5($password));
    }
}