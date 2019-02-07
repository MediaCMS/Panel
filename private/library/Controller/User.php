<?php
/**
 * Контролер користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\Recaptcha;
use MediaCMS\Panel\System;
use MediaCMS\Panel\Log;

class User extends \MediaCMS\Panel\Controller {

    /**
     * Ввивід списка користувачів
     */
    public function index(): void {

        $this->orderFields = [

            ['title' => 'Назва', 'field' => 'title'],
            ['title' => 'Доступ', 'field' => 'roleID'],
            ['title' => 'Час', 'field' => 'time']
        ];

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

            $user['edit'] = '/користувачі/редагування/' . $user['id'];

            $this->view->setItem($userNode, $user);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Редагування користувача
     */
    public function edit(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        if (count($_POST) > 0) {

            try {

                if (isset($_POST['_save'])) {

                    if (strlen($_POST['password']) == 0) unset($_POST['password']);

                    $_POST['alias'] = System::getAlias($_POST['title']);

                    $_POST['user'] = $this->user['id'];

                    unset($_POST['_save']);

                    $this->database->call('UserSet', $_POST);
                }

                if (isset($_POST['_delete']))

                    $this->database->call('UserUnset', $_POST['id']);

                $this->router->redirect('/користувачі/список');

            } catch (Exception $exception) {

                $_POST['time'] = date('Y-m-d H:i:s');

                $this->view->setItem($this->node, $_POST);

                throw $exception;
            }
        }

        $rolesNode = $this->node->addChild('roles');

        $this->database->call('RoleGetIndex');

        while($role = $this->database->getResult()) {

            $roleNode = $rolesNode->addChild('role');

            $this->view->setItem($roleNode, $role);
        }

        $userID = $this->router->getURI(2);

        if (isset($userID)) {

            $this->database->call('UserGet', $userID);

            $this->view->setItem($this->node, $this->database->getResult());

        } else {

            if (count($_POST) == 0)

                $this->node->addAttribute('role', 3);
        }
    }

    /**
     * Авторизація користувача
     */
    public function login(): void {

        $this->menu = false;

        if (!DEVELOPMENT) $this->view->setRecaptcha();

        if (count($_POST) == 0) return;

        try {

            if (!isset($_POST['email']) || (strlen($_POST['email']) == 0))

                throw new Exception('Відсутній логін');

            $this->node->addAttribute('email', $_POST['email']);

            if (!isset($_POST['password']) || (strlen($_POST['password']) == 0))

                throw new Exception('Відсутній пароль');

            if (!DEVELOPMENT) {

                if (!isset($_POST['g-recaptcha-response']) || (strlen($_POST['g-recaptcha-response']) == 0))

                    throw new Exception('Підтвердіть, що Ви не робот');

                $recaptcha = new Recaptcha(RECAPTCHA_PRIVATE);

                if (!$recaptcha->validate($_POST['g-recaptcha-response'], System::getIP())) {

                    $message = sprintf('Помилка каптчі "%s"', implode(', ', $recaptcha->getErrors()));

                    throw new Exception($message);
                }
            }

            $this->database->call('UserAuthorize', $_POST['email'], md5($_POST['password']));

            if ($this->database->getResultCount() != 1) {

                $message = sprintf('Доступ для логіна "%s" заборонено', $_POST['email']);

                throw new Exception($message);
            }

            $result = $this->database->getResult();

            $_SESSION['user'] = $result;

            $this->router->redirect($_SERVER['REQUEST_URI']);

        } catch (Exception $exception) {

            $this->view->setAlert($exception->getMessage(), 'danger');

            Log::append($exception->getMessage());
        }
    }

    /**
     * Вихід користувача
     */
    public function logout(): void {

        session_destroy();

        $this->router->redirect('/');
    }
}