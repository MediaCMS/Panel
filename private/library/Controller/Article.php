<?php
/**
 * Контролер для роботи зі статтями
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

class Article extends Controller {

    /**
     * Список статей
     */
    public function IndexAction(): void {

        $this->orderFields = [

            ['title' => 'Час', 'field' => 'time'],
            ['title' => 'Назва', 'field' => 'title'],
            ['title' => 'Категорія', 'field' => 'category'],
            ['title' => 'Мітка', 'field' => 'tag'],
            ['title' => 'Автор', 'field' => 'user']
        ];

        $this->filter['_orderField'] = 'time';

        //$this->filter['_orderDirection'] = 0;

        $this->setFilter(['dateBegin' => '2018-01-01', 'dateEnd' => date('Y-m-d')]);

        $this->database->call('ArticleGetIndex', $this->filter);

        $node = $this->view->getNode();

        $this->setItems($node->addChild('items'));

        $this->setPagination();
    }

    /**
     * Редагування статті
     */
    public function EditAction(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        $node = $this->view->getNode();

        $this->database->call('CategoryGetIndex', []);

        $this->setItems($node->addChild('categories'), 'category');

        if (count($_POST) > 0) {

            if (isset($_POST['_save'])) {

                $_POST['alias'] = System::getAlias($_POST['title']);

                $_POST['user'] = $this->user;

                try {

                    $this->database->call('ArticleSet', $_POST);

                } catch (Exception $exception) {

                    $this->view->setItem($node, $_POST);

                    throw $exception;
                }
            }

            if (isset($_POST['_delete']))

                $this->database->call('ArticleUnset', $_POST['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');
        }

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('ArticleGet', $id);

            $article = $this->database->getResult();

            $this->view->setItem($node, $article);

            if (strlen($article['tags']) > 0) {

                $this->database->call('TagGetByIDs', $article['tags']);

                $this->setItems($node->addChild('tags'), 'tag');
            }


        }
    }
}