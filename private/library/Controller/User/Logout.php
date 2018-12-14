<?php
/**
 * Контролер для виходу користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\User;

class Logout extends \MediaCMS\Panel\Controller {

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        session_destroy();

        $this->router->redirect('/');
    }
}