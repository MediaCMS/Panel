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
use MediaCMS\Panel\Image;

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

        try {

            if (count($_POST) > 0) {

                $article = $_POST;

                $this->send($article);

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

        } catch (Exception $exception) {

            $article['time'] = date('Y-m-d H:i:s');

            $article['tags'] = [];

            foreach($_POST['tags'] as $id => $title)

                $article['tags'][] = ['id' => $id, 'title' => $title];

            $this->view->setItem($node, $article);

            throw $exception;
        }
    }

    /**
     * Операції над статтею
     *
     * @param array $article Дані статті з форми
     */
    private function send(array $article): void {

        if (isset($article['_save'])) {

            $image = new Image();

            if (isset($article['image'])) {

                $image->exists($article['image']);

            } else {

                if ($_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {

                    $article['image'] = $image->append($_FILES['image']);
                }

                $this->database->call('ArticleGetImage', $article['id']);

                $hash = $this->database->getResultByName('image');

                if (strlen($hash) > 0) $image->delete($hash);
            }

            $article['tags'] = array_keys($article['tags']);

            $article['alias'] = System::getAlias($article['title']);

            $article['user'] = $this->user;

            unset($article['_save']);

            $this->database->call('ArticleSet', $article);
        }

        if (isset($article['_delete']))

            $this->database->call('ArticleUnset', $article['id']);
    }
}