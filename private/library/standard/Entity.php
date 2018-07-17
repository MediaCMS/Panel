<?php
/**
 * Абстрактний базовий клас роботи зі сутністю
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

abstract class Entity extends Dataset {

    /** @var array Спільні властивості сутності */
    protected $__propertiesCommon = [

        /** @var integer Ідентифікатор сутності */
        'id' => ['type' => 'positive4'],

        /** @var integer Ознака статусу сутності (0 - вимкнений, 1 - ввімкнений) */
        'status' => ['type' => 'bit', 'value' => 1]
    ];
}