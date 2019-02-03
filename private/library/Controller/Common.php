<?php
/**
 * Контролер загальних дій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

class Common extends \MediaCMS\Panel\Controller {

    /**
     * Запускає виконання дії контролера
     */
    public function NotFound(): void {

        $alert = 'Невідома адреса ' . urldecode($_SERVER['REQUEST_URI']);

        $this->view->setAlert($alert, 'danger');
    }
}