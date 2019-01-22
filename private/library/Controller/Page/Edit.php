<?php
/**
 * Контролер для редагування статичних сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Page;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;
use MediaCMS\Panel\Image;

class Edit extends \MediaCMS\Panel\Controller {

    /** @var array Підменю */
    protected $submenu = [['title' => 'Закрити', 'alias' => 'список']];

    /** @var boolean Ознака завантаження WYSIWYG-редактора */
    protected $editor = true;


    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $node = $this->view->getNode();

        if (count($_POST) > 0) $this->input($_POST);

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('PageGet', $id);

            $this->view->setItem($node, $this->database->getResult());
        }
    }

    /**
     * Операції над статичною сторінкою
     *
     * @param array $page Дані сторінки з форми
     */
    private function input(array $page): void {

        try {

            if (isset($page['_save'])) $this->save($page);

            if (isset($page['_delete']))

                $this->database->call('PageUnset', $page['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');

        } catch (Exception $exception) {

            $page['time'] = date('Y-m-d H:i:s');

            $this->view->setItem($this->node, $page);

            throw $exception;
        }
    }

    /**
     * Зберігає статичну сторінку
     *
     * @param array $page Дані сторінки з форми
     */
    private function save(array $page): void {

        $image = new Image();

        if (isset($page['image'])) {

            $image->exists($page['image']);

        } else {

            if ($_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {

                $page['image'] = $image->append($_FILES['image']);
            }

            $this->database->call('PageGet', $page['id']);

            $hash = $this->database->getResultByName('image');

            if (strlen($hash) > 0) $image->delete($hash);
        }

        $page['text'] = html_entity_decode($page['text'], ENT_QUOTES|ENT_HTML5);

        $page['alias'] = System::getAlias($page['title']);

        $page['user'] = $this->user['id'];

        unset($page['_save']);

        $this->database->call('PageSet', $page);
    }
}