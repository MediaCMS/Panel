<?php
/**
 * Фільтр для списку користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Filter;

use MediaCMS\Panel\Filter;

/**
 * @property string     dateBegin   Початкова дата редагування користувача
 * @property string     dateEnd     Кінцева дата редагування користувача
 * @property string     title       Назва користувача
 * @property integer    roleID      Код ролі користувача
 */
class User extends Filter {

    /** @var array Властивості фільтра користувача */
    protected $__properties = [

        'dateBegin'     => ['type' => 'date', 'value' => '2018-01-01'],
        'dateEnd'       => ['type' => 'date'],
        'title'         => ['type' => 'string16'],
        'roleID'        => ['type' => 'positive1'],
        'orderField'    => ['type' => 'string16', 'value' => 'title'],
        'orderFields'   => ['value' => [

            'id' => 'ID', 'time' => 'Дата', 'title' => 'Назва',

            'roleID' => 'Роль', 'status' => 'Статус'
        ]],
    ];


    /**
     * Встановлює значення по замовчуванню
     */
    protected function setDefaults(): void {

        $this->set('dateEnd', date('Y-m-d'));
    }
}