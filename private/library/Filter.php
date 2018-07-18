<?php
/**
 * Абстрактний базовий клас для роботи з фільтром репозиторіїв
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

use MediaCMS\Panel\Exception\Filter as FilterException;

/**
 * @property integer    status          Код статусу
 * @property array      statuses        Перелік кодів статусів
 * @property string     orderField      Назва поля для сортування
 * @property array      orderFields     Перелік полів для сортування
 * @property integer    orderDirection  Код напрямку сортування
 * @property array      orderDirections Перелік напрямків сортування
 * @property integer    rowsCount       Кількість записів списку
 * @property integer    rowsOffset      Зміщення рядків в списку
 * @property integer    rowsLimit       Обмеження кількості записів сторінки переліку
 * @property array      rowsLimits      Перелік дозволених кількостей записів сторінки переліку
 * @property integer    pageCurrent     Номер поточної сторінки списку
 * @property integer    pagesCount      Кількість сторінок списку
 */
abstract class Filter extends Dataset {

    /** @var array Спільні властивості фільтрів */
    protected $__propertiesCommon = [

        'status'            => ['type' => 'bit'],
        'statuses'          => ['access' => 0, 'value' => [1 => 'Ввімкнений', 0 => 'Вимкнений']],
        'orderField'        => ['pattern' => '/^[a-z0-9]{1,8}$/ui', 'value' => 'id'],
        'orderFields'       => ['access' => 0],
        'orderDirection'    => ['type' => 'bit', 'value' => 1],
        'orderDirections'   => ['access' => 0, 'value' => [1 => 'Висхідний', 0 => 'Низхідний']],
        'rowsCount'         => ['type' => 'positive4', 'value' => 0],
        'rowsOffset'        => ['type' => 'positive4', 'access' => 0, 'value' => 0],
        'rowsLimit'         => ['type' => 'positive4', 'value' => 11],
        'rowsLimits'        => ['access' => 0, 'value' => [3 => '3', 5 => '5', 7 => '7', 11 => '11', 13 => '13']],
        'pageCurrent'       => ['type' => 'positive4', 'value' => 1],
        'pagesCount'        => ['type' => 'positive4', 'access' => 0, 'value' => 1],
    ];


    /**
     * Зберігає поле для сортування
     *
     * @param string $orderField Назва поля
     */
    protected function setOrderField(string $orderField): void {

        if (!key_exists($this->orderField, $this->orderFields)) {

            $exception = 'Неприпустима назва поля для сортування "%s->orderField = %s"';

            throw new FilterException(sprintf($exception, $orderField));
        }

        $this->set('orderField', $orderField);
    }

    /**
     * Отримує та зберігає кількість записів списку
     *
     * @param integer $rowsCount Кількість записів
     */
    protected function setRowsCount(int $rowsCount): void {

        $this->set('rowsCount', $rowsCount);

        $this->setPagesCount();
    }

    /**
     * Вираховує та зберігає зміщення рядків в списку
     */
    protected function setRowsOffset(): void {

        $this->set('rowsOffset', ($this->pageCurrent - 1) * $this->rowsLimit);
    }

    /**
     * Зберігає обмеження кількості рядків на сторінку
     *
     * @param integer $rowsLimit Кількість рядків
     */
    protected function setRowsLimit(int $rowsLimit): void {

        if (!key_exists($this->rowsLimit, $this->rowsLimits)) {

            $exception = 'Неприпустиме кількість рядків на сторінку "%s->rowsLimit = %s"';

            throw new FilterException(sprintf($exception, $rowsLimit));
        }

        $this->set('rowsLimit', $rowsLimit);

        $this->setRowsOffset();
    }

    /**
     * Зберігає номер поточної сторінки
     *
     * @param integer $pageCurrent Номер сторінки
     */
    protected function setPageCurrent(int $pageCurrent): void {

        $this->set('pageCurrent', $pageCurrent);

        $this->setRowsOffset();
    }

    /**
     * Отримує та зберігає кількість сторінок переліку
     */
    protected function setPagesCount(): void {

        $this->set('pagesCount', ceil($this->rowsCount / $this->rowsLimit));
    }
}