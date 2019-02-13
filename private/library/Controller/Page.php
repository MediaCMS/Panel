<?php
/**
 * Контролер сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

class Page extends \MediaCMS\Panel\Controller {

    /**
     * Редагує сторінку
     */
    public function edit(): void {

        $this->editor = true;

        parent::edit();
    }

    /**
     * Перевіряє доступ для редагування сторінки
     */
    protected function access(): void {

        if ($this->user['roleID'] > 2) $this->denied();
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