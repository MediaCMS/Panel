<?php
/**
 * Контролер для роботи з користувачами
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;
use MediaCMS\Panel\Repository\Role as RoleRepository;
use MediaCMS\Panel\Repository\User as UserRepository;

class User extends Controller {

    /** @var UserRepository Репозиторій користувачів */
    protected $repository;

    /**
     * Головний метод контролера
     */
    public function run(): void {}

    /**
     * Отримує перелік ролей та додає їх у вигляд
     *
     * @param \SimpleXMLElement $node Батьківський елемент виводу
     * @param integer|null $id Активна роль
     * @param boolean $common Ознака додавання загального пункту у перелік
     */
    protected function setRoles(\SimpleXMLElement $node, ?int $id = null, bool $common = false): void {

        $roleRepository = new RoleRepository($this->mapper);

        $roleCollection = $roleRepository->getIndex();

        $rolesNode = $node->addChild('roles');

        if ($common) {

            $roleNode = $rolesNode->addChild('role');

            $roleNode->addAttribute('title', 'Всі ролі');
        }

        foreach($roleCollection as $roleEntity) {

            $roleNode = $rolesNode->addChild('role');

            $this->setEntity($roleNode, $roleEntity);

            if ($roleEntity->id == $id)

                $roleNode->addAttribute('active', 'true');
        }
    }
}