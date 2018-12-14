<?php
/**
 * Контролер для виводу списка статей базовий (шаблон)
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

abstract class Index extends \MediaCMS\Panel\Controller {

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

        $articlesNode = $this->node->addChild('articles');

        $i = 1;

        while($article = $this->database->getResult()) {

            $articleNode = $articlesNode->addChild('article');

            $article['position'] = $this->filter['_offset'] + $i;

            $article['edit'] = '/' . $this->router->getURI(0) . '/редагування/' . $article['id'];

            $this->view->setItem($articleNode, $article);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }
}