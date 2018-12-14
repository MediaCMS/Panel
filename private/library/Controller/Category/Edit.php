<?php
/**
 * Контролер для редагування категорії
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Category;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;
use MediaCMS\Panel\Image;

class Edit extends \MediaCMS\Panel\Controller\Category {

    /** @var array Підменю */
    protected $submenu = [['title' => 'Закрити', 'alias' => 'список']];


    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        if (count($_POST) > 0) $this->input($_POST);

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('CategoryGet', $id);

            $this->view->setItem($this->node, $this->database->getResult());
        }
    }

    /**
     * Операції над категоріїю
     *
     * @param array $category Дані категорії з форми
     */
    private function input(array $category): void {

        try {

            if (isset($category['_save'])) $this->save($category);

            if (isset($category['_delete']))

                $this->database->call('CategoryUnset', $category['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');

        } catch (Exception $exception) {

            $category['time'] = date('Y-m-d H:i:s');

            $this->view->setItem($this->node, $category);

            throw $exception;
        }
    }

    /**
     * Зберігає категорію
     *
     * @param array $category Дані категорії з форми
     */
    private function save(array $category): void {

        $image = new Image();

        if (isset($category['image'])) {

            $image->exists($category['image']);

        } else {

            if ($_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {

                $category['image'] = $image->append($_FILES['image']);
            }

            $this->database->call('CategoryGetImage', $category['id']);

            $hash = $this->database->getResultByName('image');

            if (strlen($hash) > 0) $image->delete($hash);
        }

        $category['alias'] = System::getAlias($category['title']);

        $category['user'] = $this->user['id'];

        unset($category['_save']);

        $this->database->call('CategorySet', $category);
    }
}