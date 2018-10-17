<?php
/**
 * Контролер для роботи з коментарями
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use  MediaCMS\Panel\Controller;
use  MediaCMS\Panel\Exception;

class Comment extends Controller {

    /**
     * Список статичних сторінок
     */
    public function IndexAction(): void {

        unset($this->submenu[0]);

        $this->setFilter(['dateBegin' => '2018-01-01', 'dateEnd' => date('Y-m-d')]);

        $this->database->call('CommentGetIndex', $this->filter);

        $node = $this->view->getNode();

        $this->setItems($node->addChild('items'));

        $this->setPagination();

    }

    /**
     * Редагування статичної сторінки
     */
    public function EditAction(): void {

        $id = $this->router->getURI(2);

        if (!isset($id)) {

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');

            throw new Exception('Відсутній ідентифікатор коментаря');
        }

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        $node = $this->view->getNode();

        if (count($_POST) > 0) {

            if (isset($_POST['_save'])) {

                try {

                    $this->database->call('CommentSet', $_POST);

                } catch (Exception $exception) {

                    $this->view->setItem($node, $_POST);

                    throw $exception;
                }
            }

            if (isset($_POST['_delete']))

                $this->database->call('CommentUnset', $_POST['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');
        }

        $this->database->call('CommentGet', $id);

        $this->view->setItem($node, $this->database->getResult());

    }
}