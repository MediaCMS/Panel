<?php
/**
 * Контролер для виводу списка категорій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Category;

class Index extends \MediaCMS\Panel\Controller\Category {

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $this->setFilter();

        $this->database->call('CategoryGetIndex', $this->filter);

        $this->setItems();

        $this->setPagination();
    }
}