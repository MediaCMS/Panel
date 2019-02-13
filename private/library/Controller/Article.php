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

class Article extends \MediaCMS\Panel\Controller {

    /**
     * Створює та виводить фільтр списка статей
     */
    protected function filter(): void {

        $this->orderFields = [

            ['title' => 'Час', 'field' => 'time'],
            ['title' => 'Назва', 'field' => 'title'],
            ['title' => 'Категорія', 'field' => 'category'],
            ['title' => 'Мітка', 'field' => 'tag'],
            ['title' => 'Автор', 'field' => 'user']
        ];

        $this->filter['dateBegin'] = '2018-01-01';

        $this->filter['dateEnd'] = date('Y-m-d');

        $this->filter['_orderField'] = 'time';

        parent::filter();
    }

    /**
     * Перевіряє доступ для редагування статті
     *
     * TODO: Modify access rules
     */
    protected function access(): void {

        if ($this->user['roleID'] > 2) $this->denied();
    }

    /**
     * Повертає дані у форму
     *
     * @param array $article Дані форми
     */
    protected function submitRepeat(array $article): void {

        $article['tags'] = [];

        foreach($_POST['tags'] as $id => $title)

            $article['tags'][] = ['id' => $id, 'title' => $title];

        parent::submitRepeat($article);
    }

    /**
     * Редагує (додатково)
     */
    public function editAdvanced(): void {

        $this->database->call('CategoryGetIndex', []);

        $categoriesNode = $this->node->addChild('categories');

        while($category = $this->database->getResult()) {

            $categoryNode = $categoriesNode->addChild('category');

            $this->view->setItem($categoryNode, $category);
        }
    }

    /**
     * Отримує статтю з БД
     *
     * @param integer $id Ідентифікатор статті
     * @return array Дані статті
     */
    protected function get(int $id): array {

        $article = parent::get($id);

        if (strlen($article['tags']) > 0) {

            $this->database->call('TagGetByIDs', $article['tags']);

            $tagsNode = $this->node->addChild('tags');

            while($tag = $this->database->getResult()) {

                $tagNode = $tagsNode->addChild('tag');

                $this->view->setItem($tagNode, $tag);
            }
        }

        return $article;
    }

    /**
     * Зберігає статтю в БД
     *
     * @param array $article Дані статті
     */
    protected function set(array $article): void {

        $article['text'] = html_entity_decode($article['text'], ENT_QUOTES|ENT_HTML5);

        $article['tags'] = array_keys($article['tags']);

        parent::set($article);
    }
}