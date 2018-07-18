<?php
/**
 * Клас роботи з Recaptcha
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel\Recaptcha
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

class Recaptcha {

    /** @var string Адреса перевірки капчі */
    protected $url = 'https://www.google.com/recaptcha/api/siteverify';

    /** @var string Таємний ключ для перевірки */
    protected $key;

    /** @var array Масив для збереження помилок при наявності */
    protected $errors = array();


    public function __construct(string $key) {

        $this->key = $key;
    }

    /**
     * Перевіряє каптчу
     *
     * @param   string $response Відповідь каптчи
     * @param   string $ip ip-адреса користувача
     * @return  boolean Результат перевірки
     */
    public function validate(string $response, string $ip) : bool {

        $channel = curl_init();

        curl_setopt($channel, CURLOPT_URL, $this->url);

        curl_setopt($channel, CURLOPT_POST, 1);

        curl_setopt($channel, CURLOPT_POSTFIELDS,

            array(

                'secret' => $this->key,

                'response' => $response,

                'remoteip' => $ip
            )
        );

        curl_setopt($channel, CURLOPT_RETURNTRANSFER, true);

        $responce = json_decode(curl_exec($channel), true);

        curl_close ($channel);

        if ($responce['success'] === false) {

            $this->errors = $responce['error-codes'];

            return false;
        }

        return true;
    }

    /**
     * Повертає масив з помилками
     *
     * @return array Масив з помилками
     */
    public function getErrors() : array {

        return $this->errors;
    }
}