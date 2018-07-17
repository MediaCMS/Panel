<?php
/**
 * Контролер для виводу списку користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Controller\User;

use MediaCMS\Panel\Controller\User as UserController;
use MediaCMS\Panel\Filter\User as UserFilter;
use MediaCMS\Panel\Repository\User as UserRepository;

class Index extends UserController {

    /** @var UserFilter Список даних фільтру */
    protected $filter = 'User';


    /**
     * Головний метод контролера
     */
    public function run(): void {

        $this->repository = new UserRepository($this->mapper);

        $userCollection = $this->repository->getIndex($this->filter);

        if (!isset($userCollection)) return;

        $usersNode = $this->template->addChild('users');

        foreach($userCollection as $key => $userEntity) {

            $userNode = $usersNode->addChild('user');

            $this->setEntity($userNode, $userEntity);

            $uri = '/' . $this->router->getURI(0) . '/редагування/' . $userEntity->id;

            $userNode->addAttribute('edit', $uri);

            $userNode->addAttribute('position', $this->filter->rowsOffset + $key + 1);
        }
    }

    /**
     * Створює фільтр для списку користувачів та додає його у вигляд
     */
    protected function setFilterExtension(): void {

        $templateNode = $this->template;

        $filterNode = $templateNode->filter;

        $filterNode->addAttribute('dateBegin', $this->filter->dateBegin);

        $filterNode->addAttribute('dateEnd', $this->filter->dateEnd);

        $filterNode->addAttribute('title', $this->filter->title);

        $this->setRoles($filterNode, $this->filter->roleID, true);
    }
}