<?php
/**
 * Контролер для роботи з мітками
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

class Tag extends Controller {

    /**
     * Список статичних сторінок
     */
    public function IndexAction(): void {

        $this->setFilter();

        $this->database->call('TagGetIndex', $this->filter);

        $node = $this->view->getNode();

        $this->setItems($node->addChild('items'));

        $this->setPagination();
    }

    /**
     * Редагування статичної сторінки
     */
    public function EditAction(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        $node = $this->view->getNode();

        if (count($_POST) > 0) {

            if (isset($_POST['_save'])) {

                $_POST['alias'] = System::getAlias($_POST['title']);

                $_POST['user'] = $this->user;

                try {

                    $this->database->call('TagSet', $_POST);

                } catch (Exception $exception) {

                    $this->view->setItem($node, $_POST);

                    throw $exception;
                }
            }

            if (isset($_POST['_delete']))

                $this->database->call('TagUnset', $_POST['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');
        }

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('TagGet', $id);

            $this->view->setItem($node, $this->database->getResult());
        }
    }
}