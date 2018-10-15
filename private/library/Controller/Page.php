<?php
/**
 * Контролер для роботи з сторінками
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;
use MediaCMS\Panel\System;

class Page extends Controller {

    /**
     * Список статичних сторінок
     */
    public function Index(): void {

        $this->setFilter();

        $this->database->call('PageGetIndex', $this->filter);

        $indexNode = $this->view->getNode();

        $this->setItems($indexNode->addChild('items'));

        $this->setPagination();

    }

    /**
     * Редагування статичної сторінки
     */
    public function Edit(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        $node = $this->view->getNode();

        if (count($_POST) > 0) {

            if (isset($_POST['_save'])) {

                $_POST['alias'] = System::getAlias($_POST['title']);

                $_POST['user'] = $this->user;

                $this->view->setItem($node, $_POST);

                $this->database->call('PageSet', $_POST);
            }

            if (isset($_POST['_delete']))

                $this->database->call('PageUnset', $_POST['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');
        }

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('PageGet', $id);

            $this->view->setItem($node, $this->database->getResult());
        }
    }
}