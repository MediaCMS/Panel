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

class Unknown extends \MediaCMS\Panel\Controller {

    /**
     * Сторінка не знайдена
     */
    public function notFound(): void {

        $this->submenu = [];

        $alert = 'Невідома адреса ' . urldecode($_SERVER['REQUEST_URI']);

        $this->view->setAlert($alert, 'danger');

        header('HTTP/1.x 404 Not Found');
    }
}