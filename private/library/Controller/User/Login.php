<?php
/**
 * Контролер для авторизації користувача
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\User;

use MediaCMS\Panel\System;
use MediaCMS\Panel\Recaptcha;
use MediaCMS\Panel\Exception;
use MediaCMS\Panel\Log;

class Login extends \MediaCMS\Panel\Controller {

    /** @var boolean Ознака створення меню */
    protected $menu = false;


    /**
     * Авторизація користувача
     */
    public function run(): void {

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
}