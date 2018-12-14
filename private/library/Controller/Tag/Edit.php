<?php
/**
 * Контролер для редагування міток
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Tag;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;
use MediaCMS\Panel\Image;

class Edit extends \MediaCMS\Panel\Controller\Tag {

    /** @var array Підменю */
    protected $submenu = [['title' => 'Закрити', 'alias' => 'список']];


    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        if (count($_POST) > 0) $this->input($_POST);

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('TagGet', $id);

            $this->view->setItem($this->node, $this->database->getResult());
        }
    }

    /**
     * Операції над міткою
     *
     * @param array $tag Дані мітки з форми
     */
    private function input(array $tag): void {

        try {

            if (isset($tag['_save'])) $this->save($tag);

            if (isset($tag['_delete']))

                $this->database->call('TagUnset', $tag['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');

        } catch (Exception $exception) {

            $tag['time'] = date('Y-m-d H:i:s');

            $this->view->setItem($this->node, $tag);

            throw $exception;
        }
    }

    /**
     * Зберігає мітку
     *
     * @param array $tag Дані мітки з форми
     */
    private function save(array $tag): void {

        $image = new Image();

        if (isset($tag['image'])) {

            $image->exists($tag['image']);

        } else {

            if ($_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {

                $tag['image'] = $image->append($_FILES['image']);
            }

            $this->database->call('TagGet', $tag['id']);

            $hash = $this->database->getResultByName('image');

            if (strlen($hash) > 0) $image->delete($hash);
        }

        $tag['alias'] = System::getAlias($tag['title']);

        $tag['user'] = $this->user['id'];

        unset($tag['_save']);

        $this->database->call('TagSet', $tag);
    }
}