<?php
/**
 * Абстрактний базовий клас роботи з колекцією сутностей
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

use MediaCMS\Panel\Entity as Entity;
use MediaCMS\Panel\Exception\Collection as CollectionException;

abstract class Collection implements \IteratorAggregate  {

    /** @var array Внутрішній робочий масив */
    private $items = [];

    /** @var integer Кількість елементів в масиві */
    private $count = 0;

    /** @var string Назва сутностей колекції */
    protected $entity;


    /**
     * Конструктор класу
     *
     * @param array $data Дані для сутностей
     */
    public function __construct(array $data = null) {

        if (isset($data)) {

            foreach($data as $value) {

                $entity = sprintf('MediaCMS\Panel\Entity\%s', $this->entity);

                $entity = new $entity($value);

                $this->add($entity);
            }

        }
    }

    /**
     * Повертає ітератор з робочим масивом
     *
     * @return Iterator Ітератор з робочим масивом
     */
    public function getIterator(): Iterator {

        return new Iterator($this->items);
    }

    /**
     * Додає новий едемент до масиву
     *
     * @param Entity $value Значення нового елементу масиву
     * @throws CollectionException Виняток для колекцій
     */
    public function add(Entity $value) {

        $entity = 'MediaCMS\Panel\Entity\\' . $this->entity;

        if ($value instanceof $entity) {

            $this->items[$this->count++] = $value;

        } else {

            $exception = 'Додана сутність "%s" не відповідає вимогам "%s"';

            throw new CollectionException(sprintf($exception, $value, $this->entity));
        }
    }
}