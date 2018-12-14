<?php
/**
 * Контролер для редагування статі
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Article;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;
use MediaCMS\Panel\Image;

class Edit extends \MediaCMS\Panel\Controller\Article {

    /** @var array Підменю */
    protected $submenu = [['title' => 'Закрити', 'alias' => 'список']];


    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $this->database->call('CategoryGetIndex', []);

        $this->setItems('categories', 'category');

        if (count($_POST) > 0) $this->input($_POST);

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('ArticleGet', $id);

            $article = $this->database->getResult();

            $this->view->setItem($this->node, $article);

            if (strlen($article['tags']) > 0) {

                $this->database->call('TagGetByIDs', $article['tags']);

                $this->setItems('tags', 'tag');
            }
        }
    }

    /**
     * Операції над статтею
     *
     * @param array $article Дані статті з форми
     */
    private function input(array $article): void {

        try {

            if (isset($article['_save'])) $this->save($article);

            if (isset($article['_delete']))

                $this->database->call('ArticleUnset', $article['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');

        } catch (Exception $exception) {

            $article['time'] = date('Y-m-d H:i:s');

            $article['tags'] = [];

            foreach($_POST['tags'] as $id => $title)

                $article['tags'][] = ['id' => $id, 'title' => $title];

            $this->view->setItem($this->node, $article);

            throw $exception;
        }
    }

    /**
     * Зберігає статтю
     *
     * @param array $article Дані статті з форми
     */
    private function save(array $article): void {

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

        $article['user'] = $this->user['id'];

        unset($article['_save']);

        $this->database->call('ArticleSet', $article);
    }
}