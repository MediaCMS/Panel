<?php
/**
 * Контролер для виводу списка категорій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Category;

class Index extends \MediaCMS\Panel\Controller {

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $this->setFilter();

        $this->database->call('CategoryGetIndex', $this->filter);

        $i = 1;

        $categoriesNode = $this->node->addChild('categories');

        while($category = $this->database->getResult()) {

            $categoryNode = $categoriesNode->addChild('category');

            $category['position'] = $this->filter['_offset'] + $i;

            $category['edit'] = '/' . $this->router->getURI(0) . '/редагування/' . $category['id'];

            $this->view->setItem($categoryNode, $category);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }
}