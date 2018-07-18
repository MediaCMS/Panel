<?php
/**
 * Контролер для роботи з сторінками
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;
use MediaCMS\Panel\Repository\Page as PageRepository;
use MediaCMS\Panel\Repository\User as UserRepository;
use MediaCMS\Panel\Filter\User as UserFilter;

class Page extends Controller {

    /** @var PageRepository Репозиторій користувачів */
    protected $repository;

    /**
     * Головний метод контролера
     */
    public function run(): void {}

    /**
     * Отримує перелік користувачів та додає їх у вигляд
     *
     * @param \SimpleXMLElement $node Батьківський елемент виводу
     * @param boolean $common Ознака додавання загального пункту у перелік
     */
    protected function setUsers(\SimpleXMLElement $node, bool $common = false): void {

        $userRepository = new UserRepository($this->mapper);

        $userFilter = new UserFilter();

        $userCollection = $userRepository->getIndex($userFilter);

        $usersNode = $node->addChild('users');

        if ($common) {

            $userNode = $usersNode->addChild('user');

            $userNode->addAttribute('title', 'Всі користувачі');
        }

        $this->setCollection($usersNode, $userCollection);
    }
}