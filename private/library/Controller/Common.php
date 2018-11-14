<?php
/**
 * Контролер для роботи з загальними діями
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;

class Common extends Controller {

    /**
     * Сторінка не знайдена (невідома адреса)
     */
    public function NotFoundAction(): void {

        $alert = 'Невідома адреса ' . urldecode($_SERVER['REQUEST_URI']);

        $this->view->setAlert($alert, 'danger');
    }
}