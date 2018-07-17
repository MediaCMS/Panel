<?php
/**
 * Абстрактний базовий клас для роботи з логом
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel\Log
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

abstract class Log {

    /** @var string Назва файлу лога */
    protected static $file;


    /**
     * Додає запис в файл лога
     *
     * @param string $message Повідомлення, що повинно записатись в лог-файл
     */
    public static function append(string $message) {

        $file = PATH_PRIVATE . '/logs/' . static::$file;

        $string['time'] = date('Y-m-d H:i:s');

        $string['ip'] = sprintf("[%21s]", System::getIP() . ':' . $_SERVER['REMOTE_PORT']);

        $string['description'] = '"' . $message . '"';

        if (isset($_SERVER['HTTP_USER_AGENT']))

            $string['agent'] = '"' . $_SERVER['HTTP_USER_AGENT'] . '"';

        $string = implode('  ', $string) . "\n";

        file_put_contents($file, $string, FILE_APPEND | LOCK_EX);
    }
}