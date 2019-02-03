<?php
/**
 * Контролер категорій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;

class Category extends \MediaCMS\Panel\Controller {

    /**
     * Вивід списку категорій
     */
    public function IndexAction(): void {

        $this->setFilter();

        $this->database->call('CategoryGetIndex', $this->filter);

        $i = 1;

        $categoriesNode = $this->node->addChild('categories');

        while($category = $this->database->getResult()) {

            $categoryNode = $categoriesNode->addChild('category');

            $category['position'] = $this->filter['_offset'] + $i;

            $category['edit'] = '/категорії/редагування/' . $category['id'];

            $this->view->setItem($categoryNode, $category);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Редагування категорій
     */
    public function EditAction(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        if (count($_POST) > 0) {

            try {

                if (isset($_POST['_save'])) {

                    $_POST['alias'] = System::getAlias($_POST['title']);

                    $_POST['user'] = $this->user['id'];

                    unset($_POST['_save']);

                    $this->database->call('CategorySet', $_POST);
                }

                if (isset($_POST['_delete']))

                    $this->database->call('CategoryUnset', $_POST['id']);

                $this->router->redirect('/категорії/список');

            } catch (Exception $exception) {

                $_POST['time'] = date('Y-m-d H:i:s');

                $this->view->setItem($this->node, $_POST);

                throw $exception;
            }
        }

        $categoryID = $this->router->getURI(2);

        if (isset($categoryID)) {

            $this->database->call('CategoryGet', $categoryID);

            $this->view->setItem($this->node, $this->database->getResult());
        }
    }
}