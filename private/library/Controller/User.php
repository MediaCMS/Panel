<?php
/**
 * Контролер користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\Recaptcha;
use MediaCMS\Panel\System;
use MediaCMS\Panel\Log;

class User extends \MediaCMS\Panel\Controller {

    /**
     * Створює та виводить фільтр списка користувачів
     */
    protected function filter(): void {

        $this->orderFields = [

            ['title' => 'Назва',    'field' => 'title'],
            ['title' => 'Доступ',   'field' => 'roleID'],
            ['title' => 'Час',      'field' => 'time']
        ];

        $this->filterDefault['dateBegin']   = '2018-01-01';
        $this->filterDefault['dateEnd']     = date('Y-m-d');

        parent::filter();

        $this->database->call('RoleGetIndex');

        $roles = $this->database->getResults();

        array_unshift($roles, ['id' => null, 'title' => 'Всі ролі']);

        $this->view->setItems($this->node->filter->addChild('roles'), $roles);
    }

    /**
     * Редагує користувача (додатково)
     */
    public function editAdvanced(): void {

        $this->database->call('RoleGetIndex');

        $this->setItems('roles', 'role');

        if (is_null($this->router->getURI(2)) && (count($_POST) == 0))

            $this->node->addAttribute('role', 3);
    }

    /**
     * Зберігає користувача в БД
     *
     * @param array $user Дані користувача
     */
    protected function set(array $user): void {

        if (strlen($user['password']) > 0)

            if ($user['password'] != $user['password2'])

                throw new Exception('Паролі відрізняються');

        parent::set($user);
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