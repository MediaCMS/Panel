<?php
/**
 * Контролер коментарів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use  MediaCMS\Panel\Exception;

class Comment extends \MediaCMS\Panel\Controller {

    /**
     * Вивід списка коментарів
     */
    public function IndexAction(): void {

        unset($this->submenu[0]);

        $this->setFilter(['dateBegin' => '2018-01-01', 'dateEnd' => date('Y-m-d')]);

        $this->database->call('CommentGetIndex', $this->filter);

        $i = 1;

        $commentsNode = $this->node->addChild('comments');

        while($comment = $this->database->getResult()) {

            $commentNode = $commentsNode->addChild('comment');

            $comment['position'] = $this->filter['_offset'] + $i;

            $comment['edit'] = '/коментарі/редагування/' . $comment['id'];

            $this->view->setItem($commentNode, $comment);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Редагування коментаря
     */
    public function EditAction(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        $commentID = $this->router->getURI(2);

        if (!isset($commentID)) {

            $this->router->redirect('/коментарі/список');

            throw new Exception('Відсутній ідентифікатор коментаря');
        }

        if (count($_POST) > 0) {

            try {

                if (isset($_POST['_save'])) {

                    unset($_POST['_save']);

                    $this->database->call('CommentSet', $_POST);
                }

                if (isset($_POST['_delete']))

                    $this->database->call('CommentUnset', $_POST['id']);

                $this->router->redirect('/коментарі/список');

            } catch (Exception $exception) {

                $this->view->setItem($this->node, $_POST);

                throw $exception;
            }
        }

        $this->database->call('CommentGet', $commentID);

        $this->view->setItem($this->node, $this->database->getResult());
    }
}