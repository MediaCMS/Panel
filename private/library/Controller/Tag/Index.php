<?php
/**
 * Контролер для виводу списку міток
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Tag;

class Index extends \MediaCMS\Panel\Controller {

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $this->setFilter();

        $this->database->call('TagGetIndex', $this->filter);

        $i = 1;

        $tagsNode = $this->node->addChild('tags');

        while($tag = $this->database->getResult()) {

            $tagNode = $tagsNode->addChild('tag');

            $tag['position'] = $this->filter['_offset'] + $i;

            $tag['edit'] = '/' . $this->router->getURI(0) . '/редагування/' . $tag['id'];

            $this->view->setItem($tagNode, $tag);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }
}