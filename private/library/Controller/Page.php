<?php
/**
 * Контролер сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;

class Page extends \MediaCMS\Panel\Controller {

    /**
     * Вивід списка сторінок
     */
    public function index(): void {

        $this->setFilter();

        $this->database->call('PageGetIndex', $this->filter);

        $i = 1;

        $pagesNode = $this->node->addChild('pages');

        while($page = $this->database->getResult()) {

            $pageNode = $pagesNode->addChild('page');

            $page['position'] = $this->filter['_offset'] + $i;

            $page['edit'] = '/сторінки/редагування/' . $page['id'];

            $this->view->setItem($pageNode, $page);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Редагування сторінок
     */
    public function edit(): void {

        $this->editor = true;

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        if (count($_POST) > 0) {

            try {

                if (isset($_POST['_save'])) {

                    $_POST['text'] = html_entity_decode($_POST['text'], ENT_QUOTES|ENT_HTML5);

                    $_POST['alias'] = System::getAlias($_POST['title']);

                    $_POST['user'] = $this->user['id'];

                    unset($_POST['_save']);

                    $this->database->call('PageSet', $_POST);
                }

                if (isset($_POST['_delete']))

                    $this->database->call('PageUnset', $_POST['id']);

                $this->router->redirect('/сторінки/список');

            } catch (Exception $exception) {

                $_POST['time'] = date('Y-m-d H:i:s');

                $this->view->setItem($this->node, $_POST);

                throw $exception;
            }
        }

        $pageID = $this->router->getURI(2);

        if (isset($pageID)) {

            $this->database->call('PageGet', $pageID);

            $this->view->setItem($this->node, $this->database->getResult());
        }
    }
}