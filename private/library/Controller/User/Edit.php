<?php
/**
 * Контролер для редагування користувача
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\User;

use MediaCMS\Panel\Exception;
use MediaCMS\Panel\System;
use MediaCMS\Panel\Image;

class Edit extends \MediaCMS\Panel\Controller {

    /** @var array Підменю за налаштуванням */
    protected $submenu = [['title' => 'Закрити', 'alias' => 'список']];


    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $rolesNode = $this->node->addChild('roles');

        $this->database->call('RoleGetIndex');

        while($role = $this->database->getResult()) {

            $roleNode = $rolesNode->addChild('role');

            $this->view->setItem($roleNode, $role);
        }

        if (count($_POST) > 0) $this->input($_POST);

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $this->database->call('UserGet', $id);

            $this->view->setItem($this->node, $this->database->getResult());

        } else {

            if (count($_POST) == 0)

                $this->node->addAttribute('role', 3);
        }
    }

    /**
     * Операції над користувачем
     *
     * @param array $user Дані користувача з форми
     */
    private function input(array $user): void {

        try {

            if (isset($user['_save'])) $this->save($user);

            if (isset($user['_delete']))

                $this->database->call('UserUnset', $user['id']);

            $this->router->redirect('/' . $this->router->getURI(0) . '/список');

        } catch (Exception $exception) {

            $user['time'] = date('Y-m-d H:i:s');

            $this->view->setItem($this->node, $user);

            throw $exception;
        }
    }

    /**
     * Зберігає користувача
     *
     * @param array $user Дані користувача з форми
     */
    private function save(array $user): void {
/*
        $image = new Image();

        if (isset($user['image'])) {

            $image->exists($user['image']);

        } else {

            if ($_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {

                $user['image'] = $image->append($_FILES['image']);
            }

            $this->database->call('UserGet', $user['id']);

            $hash = $this->database->getResultByName('image');

            if (strlen($hash) > 0) $image->delete($hash);
        }
*/
        if (strlen($user['password']) == 0) unset($user['password']);

        $user['alias'] = System::getAlias($user['title']);

        $user['user'] = $this->user['id'];

        unset($user['_save']);

        $this->database->call('UserSet', $user);
    }
}