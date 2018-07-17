<?php
/**
 * Контролер для редагування користувача
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Controller\User;

use MediaCMS\Panel\Entity\User as UserEntity;
use MediaCMS\Panel\Controller\User as UserController;
use MediaCMS\Panel\Repository\User as UserRepository;

class Edit extends UserController {

    /**
     * Головний метод контролера
     */
    public function run(): void {

        $this->repository = new UserRepository($this->mapper);

        if (count($_POST) > 0) {

            if (isset($_POST['save']))

                 $this->repository->set(new UserEntity($_POST));

            if (isset($_POST['delete']))

                $this->repository->unset($_POST['id']);

            $this->redirect('/' . $this->router->getURI(0) . '/список');
        }

        $id = $this->router->getURI(2);

        if (isset($id)) {

            $userEntity = $this->repository->get($id);

            $this->setEntity($this->template, $userEntity);

            $this->setRoles($this->template, $userEntity->roleID);

        } else {

            $this->setRoles($this->template, 3);
        }
    }
}