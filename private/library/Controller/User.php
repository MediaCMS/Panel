<?php
/**
 * Контролер для роботи з користувачами
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;
use MediaCMS\Panel\System;
use MediaCMS\Panel\Recaptcha;
use MediaCMS\Panel\Exception;
use MediaCMS\Panel\Log;

class User extends Controller {

    /**
     * Список користувачів
     */
    public function IndexAction(): void {

        $this->orderFields = [

            ['title' => 'Назва', 'field' => 'title'],
            ['title' => 'Доступ', 'field' => 'roleID'],
            ['title' => 'Час', 'field' => 'time']
        ];

        $this->setFilter(['dateBegin' => '2018-01-01', 'dateEnd' => date('Y-m-d')]);

        $indexNode = $this->view->getNode();

        $this->database->call('RoleGetIndex');

        $rolesNode = $indexNode->filter->addChild('roles');

        $roleNode = $rolesNode->addChild('item');

        $roleNode->addAttribute('id', null);

        $roleNode->addAttribute('title', 'Всі ролі');

        $this->setItems($rolesNode);

        $this->database->call('UserGetIndex', $this->filter);

        $this->setItems($indexNode->addChild('items'));

        $this->setPagination();
    }

    /**
     * Редагування користувача
     */
    public function EditAction(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        $node = $this->view->getNode();

        $this->database->call('RoleGetIndex');

        $this->setItems($node->addChild('roles'), 'role');

        if (count($_POST) > 0) {

            if (isset($_POST['_save'])) {

                $_POST['alias'] = System::getAlias($_POST['title']);

                try {

                    $this->database->call('UserSet', $_POST);

                } catch (Exception $exception) {

                    $this->view->setItem($node, $_POST);

                    throw $exception;
                }
            }

            if (isset($_POST['_delete']))

                $this->database->call('UserUnset', $_POST['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');
        }

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('UserGet', $id);

            $this->view->setItem($node, $this->database->getResult());

        } else {

            if (count($_POST) == 0) $node->addAttribute('role', 3);
        }
    }

    /**
     * Авторизація користувача
     */
    public function LoginAction(): void {

        $this->menu = false;

        if (!DEVELOPMENT) $this->view->setRecaptcha();

        if (count($_POST) > 0) {

            try {

                if (!isset($_POST['email']) || (strlen($_POST['email']) == 0))

                    throw new Exception('Відсутній логін');

                $this->view->getNode()->addAttribute('email', $_POST['email']);

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
    }

    /**
     * Вихід користувача
     */
    public function LogoutAction(): void {

        session_destroy();

        $this->router->redirect('/');
    }
}