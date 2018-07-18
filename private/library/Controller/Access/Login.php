<?php
/**
 * Контролер авторизації для доступу
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel\Controller\Access\Login
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Controller\Access;

use MediaCMS\Panel\Controller\Access;
use MediaCMS\Panel\Repository\User as UserRepository;
use MediaCMS\Panel\Log\Access as AccessLog;
use MediaCMS\Panel\Exception\Controller as ControllerException;
use MediaCMS\Panel\Exception\Mapper as MapperException;
use MediaCMS\Panel\Exception\View as ViewException;
use MediaCMS\Panel\Recaptcha;
use MediaCMS\Panel\System;

class Login extends Access {

    /** @var boolean Ознака створення меню */
    protected $menu = false;


    /**
     * Головний метод контролера
     *
     * @throws ControllerException  Виняток контролера
     * @throws MapperException  Виняток мапера
     * @throws ViewException  Виняток вигляду
     */
    public function run(): void {

        //$this->view->setRecaptcha();

        //$this->template->addAttribute('rememberMe', 'true');

        if (count($_POST) > 0) {

            if (!isset($_POST['remember-me'])) $this->template->attributes()->rememberMe = 0;

            if (isset($_POST['login']) && (strlen($_POST['login']) > 0)) {

                $this->template->addAttribute('login', $_POST['login']);

                if (isset($_POST['password']) && (strlen($_POST['password']) > 0)) {

                    //if (isset($_POST['g-recaptcha-response']) && (strlen($_POST['g-recaptcha-response']) > 0)) {

                        //$recaptcha = new Recaptcha();

                        //if ($recaptcha->validate($_POST['g-recaptcha-response'], System::getIP())) {

                            $user = new UserRepository($this->mapper);

                            if ($user->authorize($_POST['login'], $_POST['password'])) {

                                $_SESSION['token'] = $user->getToken();

                                $this->redirect($_SERVER['REQUEST_URI']);

                                return;

                            } else {

                                $alert = sprintf('Доступ для логіна "%s" заборонено', $_POST['login']);
                            }

                        //} else {

                            //$alert = sprintf('Помилка каптчі "%s"', implode(', ', $recaptcha->getErrors()));
                        //}

                    //} else {

                        //$alert = 'Підтвердіть, що Ви не робот';
                    //}

                } else {

                    $alert = 'Відсутній пароль';
                }

            } else {

                $alert = 'Відсутній логін';
            }

            $alert = $alert ?? 'Невідома помилка авторизації';

            $this->view->setAlert($alert, 'danger');

            AccessLog::append($alert);

        }
    }
}