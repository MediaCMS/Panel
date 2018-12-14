<?php
/**
 * Контролер для виводу списка статей
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Article;

class Index extends \MediaCMS\Panel\Controller\Article {

    /** @var array Можливі назви полів для сортування списку  */
    protected $orderFields = [

        ['title' => 'Час', 'field' => 'time'],
        ['title' => 'Назва', 'field' => 'title'],
        ['title' => 'Категорія', 'field' => 'category'],
        ['title' => 'Мітка', 'field' => 'tag'],
        ['title' => 'Автор', 'field' => 'user']
    ];

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $this->filter['_orderField'] = 'time';

        $this->setFilter(['dateBegin' => '2018-01-01', 'dateEnd' => date('Y-m-d')]);

        $this->database->call('ArticleGetIndex', $this->filter);

        $this->setItems();

        $this->setPagination();
    }
}