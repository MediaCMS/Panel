<?php
/**
 * Контролер для редагування коментарів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Comment;

use  MediaCMS\Panel\Exception;

class Edit extends \MediaCMS\Panel\Controller {

    /** @var array Підменю */
    protected $submenu = [['title' => 'Закрити', 'alias' => 'список']];


    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $id = $this->router->getURI(2);

        if (!isset($id)) {

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');

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

                $this->router->redirect('/' . $this->router->getURI(0) . '/список');

            } catch (Exception $exception) {

                $this->view->setItem($this->node, $_POST);

                throw $exception;
            }
        }

        $this->database->call('CommentGet', $id);

        $this->view->setItem($this->node, $this->database->getResult());
    }
}