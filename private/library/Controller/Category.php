<?php
/**
 * Контролер для роботи з категоріями
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;
use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;

class Category extends Controller {

    /**
     * Список категорій
     */
    public function IndexAction(): void {

        $this->setFilter();

        $this->database->call('CategoryGetIndex', $this->filter);

        $node = $this->view->getNode();

        $this->setItems($node->addChild('items'));

        $this->setPagination();
    }

    /**
     * Редагування категорії
     */
    public function EditAction(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        $node = $this->view->getNode();

        if (count($_POST) > 0) {

            if (isset($_POST['_save'])) {

                $_POST['alias'] = System::getAlias($_POST['title']);

                $_POST['user'] = $this->user;

                try {

                    $this->database->call('CategorySet', $_POST);

                } catch (Exception $exception) {

                    $this->view->setItem($node, $_POST);

                    throw $exception;
                }
            }

            if (isset($_POST['_delete']))

                $this->database->call('CategoryUnset', $_POST['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');
        }

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('CategoryGet', $id);

            $this->view->setItem($node, $this->database->getResult());
        }
    }
}