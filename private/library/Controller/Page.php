<?php
/**
 * Контролер сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;

class Page extends Controller {

    /**
     * Редагує сторінку
     */
    public function edit(): void {

        $this->editor = true;

        parent::edit();
    }

    /**
     * Зберігає сторінку в БД
     *
     * @param array $page Дані сторінки
     */
    protected function set(array $page): void {

        $page['text'] = html_entity_decode($page['text'], ENT_QUOTES|ENT_HTML5);

        parent::set($page);
    }
}