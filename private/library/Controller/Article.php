<?php
/**
 * Контролер статей
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;
use MediaCMS\Panel\Exception;

class Article extends Controller {

    /**
     * Створює та виводить фільтр списка статей
     */
    protected function filter(): void {

        $this->orderFields = [

            ['title' => 'Час',          'value' => 'time'],
            ['title' => 'Назва',        'value' => 'title'],
            ['title' => 'Категорія',    'value' => 'category'],
            ['title' => 'Мітка',        'value' => 'tag'],
            ['title' => 'Автор',        'value' => 'user']
        ];

        $this->filterDefault['dateBegin']   = '2018-01-01';
        $this->filterDefault['dateEnd']     = date('Y-m-d');
        $this->filterDefault['_orderField'] = 'time';

        if ($_SESSION['user']['roleID'] == 4) {

            $this->filter['userID'] = $_SESSION['user']['id'];

            array_pop($this->orderFields);
        }

        parent::filter();
    }

    /**
     * Повертає дані у форму
     *
     * @param array $article Дані форми
     */
    protected function submitRepeat(array $article): void {

        if (isset($article['tags'])) {

            $article['tags'] = [];

            foreach($_POST['tags'] as $id => $title)

                $article['tags'][] = ['id' => $id, 'title' => $title];
        }

        parent::submitRepeat($article);
    }

    /**
     * Редагує (додатково)
     */
    public function editAdvanced(): void {

        $this->database->call('CategoryGetIndex', []);

        $this->setItems('categories', 'category');
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

            $this->setItems('tags', 'tag');
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

        if (!isset($article['tags']))

            throw new Exception('Відсутні мітки');

        $article['tags'] = array_keys($article['tags']);

        parent::set($article);
    }
}