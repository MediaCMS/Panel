<?php
/**
 * Контролер виходу (анулювання доступу)
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel\Controller\Access\Logout
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Controller\Access;

use  MediaCMS\Panel\Controller\Access;

class Logout extends Access {

    /**
     * Головний метод контролера
     */
    public function run(): void {

        session_destroy();

        $this->redirect();
    }
}