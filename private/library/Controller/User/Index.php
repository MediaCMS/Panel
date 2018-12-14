<?php
/**
 * Контролер для виводу списку користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\User;

class Index extends \MediaCMS\Panel\Controller {

    /** @var array Можливі назви полів для сортування списку  */
    protected $orderFields = [

        ['title' => 'Назва', 'field' => 'title'],
        ['title' => 'Доступ', 'field' => 'roleID'],
        ['title' => 'Час', 'field' => 'time']
    ];

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $this->setFilter(['dateBegin' => '2018-01-01', 'dateEnd' => date('Y-m-d')]);

        $rolesNode = $this->node->filter->addChild('roles');

        $roleNode = $rolesNode->addChild('role');

        $roleNode->addAttribute('id', null);

        $roleNode->addAttribute('title', 'Всі ролі');

        $this->database->call('RoleGetIndex');

        while($role = $this->database->getResult()) {

            $roleNode = $rolesNode->addChild('role');

            $this->view->setItem($roleNode, $role);
        }

        $usersNode = $this->node->addChild('users');

        $this->database->call('UserGetIndex', $this->filter);

        $i = 1;

        while($user = $this->database->getResult()) {

            $userNode = $usersNode->addChild('user');

            $user['position'] = $this->filter['_offset'] + $i;

            $user['edit'] = '/' . $this->router->getURI(0) . '/редагування/' . $user['id'];

            $this->view->setItem($userNode, $user);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }
}