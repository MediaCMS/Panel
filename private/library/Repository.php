<?php
/**
 * Абстрактний базовий клас для роботи з репозиторієм
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

use MediaCMS\Panel\Exception\Repository as RepositoryException;

abstract class Repository {

    /** @var Mapper Мапер */
    protected $mapper;

    /** @var string Найменування репозиторію */
    protected $title;


    /**
     * Конструктор класу
     *
     * @param Mapper $mapper Мапер
     */
    public function __construct(Mapper $mapper) {

        $this->mapper = $mapper;

        $this->title = (new \ReflectionClass($this))->getShortName();
    }


    /**
     * Зберігає сутність
     *
     * @param Entity $entity Ідентифікатор сутності
     * @return integer|null Ідентифікатор створеної сутності
     */
    public function set(Entity $entity): ?int {

        if (is_subclass_of($entity, 'MediaCMS\Panel\Entity\\' . $this->title))

            throw new RepositoryException('Неприпустима сутність');

        $this->mapper->call($this->title . 'Set', $entity);

        return (!isset($id)) ? $this->mapper->getInsertId() : null;
    }

    /**
     * Повертає сутність
     *
     * @param integer $id Ідентифікатор cутності
     * @return mixed Сутність
     */
    public function get(int $id): Entity {

        $this->mapper->call($this->title . 'Get', $id);

        $entity = 'MediaCMS\Panel\Entity\\' . $this->title;

        return new $entity($this->mapper->getResultFirst());
    }

    /**
     * Повертає колекцію сутностей
     *
     * @param Filter|null $filter Фільтр
     * @return Collection Колекція статей
     */
    public function getIndex(?Filter $filter = null): ?Collection {

        if (isset($filter)) {

            if (is_subclass_of($filter, 'MediaCMS\Panel\Filter\\' . $this->title))

                throw new RepositoryException('Неприпустимий фільтр');
        }

        $this->mapper->call($this->title . 'GetIndex', $filter);

        if ($this->mapper->getResultCount() == 0) return null;

        $collection = 'MediaCMS\Panel\Collection\\' . $this->title;

        $collection = new $collection($this->mapper->getResult());

        if (isset($filter))

            $filter->rowsCount = $this->mapper->getFoundRows();

        return $collection;
    }

    /**
     * Змінює статус сутності
     *
     * @param integer $id Ідентифікатор сутності
     */
    public function unset(int $id): void {

        $this->mapper->call($this->title . 'Unset', $id);
    }
}