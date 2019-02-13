<?php
/**
 * Контролер категорій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

class Category extends \MediaCMS\Panel\Controller {

    /**
     * Перевіряє доступ для редагування категорії
     */
    protected function access(): void {

        if ($this->user['roleID'] > 2) $this->denied();
    }
}