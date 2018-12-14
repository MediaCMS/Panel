<?php
/**
 * Контролер для виводу списку коментарів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Comment;

class Index extends \MediaCMS\Panel\Controller {

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        unset($this->submenu[0]);

        $this->setFilter(['dateBegin' => '2018-01-01', 'dateEnd' => date('Y-m-d')]);

        $this->database->call('CommentGetIndex', $this->filter);

        $i = 1;

        $commentsNode = $this->node->addChild('comments');

        while($comment = $this->database->getResult()) {

            $commentNode = $commentsNode->addChild('comment');

            $comment['position'] = $this->filter['_offset'] + $i;

            $comment['edit'] = '/' . $this->router->getURI(0) . '/редагування/' . $comment['id'];

            $this->view->setItem($commentNode, $comment);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }
}