<?php
/**
 * Контролер для виводу списку міток
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Tag;

class Index extends \MediaCMS\Panel\Controller\Tag {

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $this->setFilter();

        $this->database->call('TagGetIndex', $this->filter);

        $this->setItems();

        $this->setPagination();
    }
}