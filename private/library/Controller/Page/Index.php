<?php
/**
 * Контролер для виводу списку статичних сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Page;

class Index extends \MediaCMS\Panel\Controller {

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $this->setFilter();

        $this->database->call('PageGetIndex', $this->filter);

        $i = 1;

        $pagesNode = $this->node->addChild('pages');

        while($page = $this->database->getResult()) {

            $pageNode = $pagesNode->addChild('page');

            $page['position'] = $this->filter['_offset'] + $i;

            $page['edit'] = '/' . $this->router->getURI(0) . '/редагування/' . $page['id'];

            $this->view->setItem($pageNode, $page);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }
}