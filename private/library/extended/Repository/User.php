<?php
/**
 * Клас для роботи з репозиторієм користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Repository;

use MediaCMS\Panel\Entity;
use MediaCMS\Panel\Repository;

class User extends Repository {

    /** @var string Таемний код підтвердження авторизації */
    private $token;


    /**
     * Зберігає користувача
     *
     * @param mixed $entity Ідентифікатор користувача
     * @return integer|null Ідентифікатор нового користувача
     */
    public function set(Entity $user): ?int {

        $user->time = date('Y-m-d H:i:s');

        return parent::set($user);
    }

    /**
     * Повертає код підтвердження авторизації
     *
     * @return string Код підтвердження авторизації
     */
    public function getToken(): string {

        return $this->token;
    }

    /**
     * Повертає перелік типів
     *
     * @param   string $login Логін користувача (email)
     * @param   string $password Пароль користувача
     * @return  boolean Ознака успішності авторизації
     */
    public function authorize(string $login, string $password) : bool {

        $params = ['login' => $login, 'password' => md5($password)];

        $this->mapper->call('UserAuthorize', $params);

        if ($this->mapper->getResultCount() == 1) {

            $this->token = $this->mapper->getResultByName('token');

            return true;
        }

        return false;
    }
}