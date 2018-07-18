<?php
/**
 * Головний файл з обмеженим доступом
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

use MediaCMS\Panel\Router;

session_start();

set_error_handler('exceptionErrorHandler');

spl_autoload_register('autoload');

try {

    require_once(PATH_PRIVATE . '/settings.php');

    $router = new Router();

    $controllerTitle = $router->getController();

    $controller = new $controllerTitle($router);

} catch (\Exception $exception) {

    header('HTTP/1.x 404 Not Found');

    throw $exception;
}


/**
 * Створює автозавантажувач об’єктів
 *
 * @param string $object Назва об’єкту
 */
function autoload(string $object) {

    $object = str_replace('MediaCMS\Panel', '\library\\', $object);

    $object = str_replace('\\', '/', $object);

    $class = PATH_PRIVATE . $object . '.php';

    require_once($class);
}

/**
 * Перетворює помилки у винятки
 *
 * @param integer $number Номер помилки
 * @param string $string Опис помилки
 * @param string $file Назва файлу, в якому виникла помилка
 * @param integer $line Номер рядка файлу, в якому виникла помилка
 * @throws ErrorException Error to Exception
 */
function exceptionErrorHandler(int $number, string $string, string $file, int $line) {

    throw new ErrorException($string, 0, $number, $file, $line);
}