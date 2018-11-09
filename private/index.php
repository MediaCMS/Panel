<?php
/**
 * Головний файл з обмеженим доступом
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

use MediaCMS\Panel\Router;

session_start();

set_error_handler('exceptionErrorHandler');

spl_autoload_register('autoload');

try {

    require_once(PATH_PRIVATE . '/settings.php');

    $router = new Router();

    $controllerTitle = '\MediaCMS\Panel\Controller\\' .$router->getController();

    $controller = new $controllerTitle($router);

    $action = $router->getAction() . 'Action';

    call_user_func([$controller, $action]);

} catch (\Exception $exception) {

    header('HTTP/1.x 500 Internal Server Error');

    $message = [$exception->getMessage(), $exception->getFile(), $exception->getLine(), $exception->getCode()];

    MediaCMS\Panel\Log::append(vsprintf('%s (%s:%d, %d)', $message));

    if (isset($controller) && is_object($controller)) {

        call_user_func([$controller, 'setException'], $exception);

    } else {

        throw new $exception;
    }
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
