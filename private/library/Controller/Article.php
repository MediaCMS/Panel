<?php
/**
 * Контролер статей
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;

class Article extends \MediaCMS\Panel\Controller {

    /**
     * Вивід списка статей
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

        $this->setFilter(['dateBegin' => '2018-01-01', 'dateEnd' => date('Y-m-d')]);

        $this->database->call('ArticleGetIndex', $this->filter);

        $articlesNode = $this->node->addChild('articles');

        $i = 1;

        while($article = $this->database->getResult()) {

            $articleNode = $articlesNode->addChild('article');

            $article['position'] = $this->filter['_offset'] + $i;

            $article['edit'] = '/статті/редагування/' . $article['id'];

            $this->view->setItem($articleNode, $article);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Редагування статей
     */
    public function EditAction(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        if (count($_POST) > 0) {

            try {

                if (isset($_POST['_save'])) {

                    $_POST['text'] = html_entity_decode($_POST['text'], ENT_QUOTES|ENT_HTML5);

                    $_POST['tags'] = array_keys($_POST['tags']);

                    $_POST['alias'] = System::getAlias($_POST['title']);

                    $_POST['user'] = $this->user['id'];

                    unset($_POST['_save']);

                    $this->database->call('ArticleSet', $_POST);
                }

                if (isset($_POST['_delete']))

                    $this->database->call('ArticleUnset', $_POST['id']);

                $this->router->redirect('/статті/список');

            } catch (Exception $exception) {

                $article = $_POST;

                $article['time'] = date('Y-m-d H:i:s');

                $article['tags'] = [];

                foreach($_POST['tags'] as $id => $title)

                    $article['tags'][] = ['id' => $id, 'title' => $title];

                $this->view->setItem($this->node, $article);

                throw $exception;
            }
        }

        $this->database->call('CategoryGetIndex', []);

        $categoriesNode = $this->node->addChild('categories');

        while($category = $this->database->getResult()) {

            $categoryNode = $categoriesNode->addChild('category');

            $this->view->setItem($categoryNode, $category);
        }

        $articleID = $this->router->getURI(2);

        if (isset($articleID)) {

            $this->database->call('ArticleGet', $articleID);

            $article = $this->database->getResult();

            $this->view->setItem($this->node, $article);

            if (strlen($article['tags']) > 0) {

                $this->database->call('TagGetByIDs', $article['tags']);

                $tagsNode = $this->node->addChild('tags');

                while($tag = $this->database->getResult()) {

                    $tagNode = $tagsNode->addChild('tag');

                    $this->view->setItem($tagNode, $tag);
                }
            }
        }
    }
}