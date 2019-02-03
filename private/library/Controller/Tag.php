<?php
/**
 * Контролер міток
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;

class Tag extends \MediaCMS\Panel\Controller {

    /**
     * Вивід списка міток
     */
    public function IndexAction(): void {

        $this->setFilter();

        $this->database->call('TagGetIndex', $this->filter);

        $i = 1;

        $tagsNode = $this->node->addChild('tags');

        while($tag = $this->database->getResult()) {

            $tagNode = $tagsNode->addChild('tag');

            $tag['position'] = $this->filter['_offset'] + $i;

            $tag['edit'] = '/мітки/редагування/' . $tag['id'];

            $this->view->setItem($tagNode, $tag);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Редагування міток
     */
    public function EditAction(): void {

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        if (count($_POST) > 0) {

            try {

                if (isset($_POST['_save'])) {

                    $_POST['alias'] = System::getAlias($_POST['title']);

                    $_POST['user'] = $this->user['id'];

                    unset($_POST['_save']);

                    $this->database->call('TagSet', $_POST);
                }

                if (isset($_POST['_delete']))

                    $this->database->call('TagUnset', $_POST['id']);

                $this->router->redirect('/мітки/список');

            } catch (Exception $exception) {

                $_POST['time'] = date('Y-m-d H:i:s');

                $this->view->setItem($this->node, $_POST);

                throw $exception;
            }
        }

        $tagID = $this->router->getURI(2);

        if (isset($tagID)) {

            $this->database->call('TagGet', $tagID);

            $this->view->setItem($this->node, $this->database->getResult());
        }
    }

    /**
     * Вивід міток для автозаповнення
     */
    public function AutocompleteAction(): void {

        $exclude = $_GET['exclude'] ?? null;

        $this->database->call('TagAutocomplete', $_GET['title'], $exclude);

        $tags = $this->database->getResults();

        $this->api->setData($tags);

        //$this->api->setDebug('$_GET', $_GET);

        //$this->api->setDebug('queries', $this->database->getQueries());

        //$this->api->setDebug('results', $tags);
    }
}