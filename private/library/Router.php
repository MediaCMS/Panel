<?php
/**
 * Маршрутизатор (вибір необхідного контролера та дії)
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel;

class Router {

    /** @var string Адреса файла схеми сайта */
    protected $file = '/schema.json';

    /** @var array Перелік частин адреси сторінки */
    protected $uri;

    /** @var array Схема сайта */
    protected $schema;

    /** @var string Назва поточного контролера */
    protected $controller;

    /** @var string Назва поточної дії */
    protected $action;

    /** @var string Заголовок сторінки */
    protected $title;

    /** @var string Ознака автоматичного створення об'єкта бази даних */
    protected $isDatabase = true;

    /** @var string Ознака автоматичного створення об'єкта вигляду */
    protected $isView = true;

    /** @var array Перелік кодів та опису переадресації */
    protected $redirects = [

        300 => 'Multiple Choices',
        301 => 'Moved Permanently',
        302 => 'Moved Temporarily',
        303 => 'See Other',
        304 => 'Not Modified',
        305 => 'Use Proxy',
        306 => '',
        307 => 'Temporary Redirect'
    ];


    /**
     * Конструктор класу
     */
    public function __construct() {

        $this->setURI();

        if (!isset($_SESSION['user']) || !isset($_SESSION['user']['token'])

            || !preg_match('/^[0-9a-f]{32}$/', $_SESSION['user']['token'])

            || !isset($_SESSION['user']['id']) || !preg_match('/^\d{1,6}$/', $_SESSION['user']['id'])) {

            $this->setController('User');

            $this->setAction('Login');

            $this->setTitle('Авторизація');

        } else {

            $this->setSchema();

            if (empty($this->getURI(0)))

                $this->redirect('/' . current($this->schema)['alias']);

            $this->route();

            if (!isset($this->controller)) {

                $this->setController('Unknown');

                $this->setAction('NotFound');

                $this->setTitle('Сторінка не знайдена');

            }
        }
    }

    /**
     * Отримує та зберігає ідентифікатор сторінки у вигляді переліку його елементів
     */
    private function setURI(): void {

        $request = urldecode($_SERVER['REQUEST_URI']);

        preg_match_all('/\/([^\?]*)\??/i', $request, $this->uri);

        $this->uri = explode('/', $this->uri[1][0]);
    }

    /**
     * Повертає елемент ідентифікатора сторінки
     *
     * @param integer $key Ключ елемента
     * @return string|null Назва елемента
     */
    public function getURI(int $key): ?string {

        return $this->uri[$key] ?? null;
    }

    /**
     * Перевіряє наявність елемента ідентифікатора сторінки
     *
     * @param integer $key Ключ елемента
     * @return boolean Ознака наявності
     */
    public function issetURI(int $key): bool {

        return isset($this->uri[$key]);
    }

    /**
     * Отримує та зберігає схему сайта
     */
    private function setSchema(): void {

        $this->schema = json_decode(

            file_get_contents(PATH_PRIVATE . $this->file), true
        );
    }
    /**
     * Повертає схему сайту
     *
     * @return array Схема сайта
     */
    public function getSchema(): array {

        return $this->schema;
    }

    /**
     * Вибирає контролер та дію
     */
    private function route(): void {

        foreach($this->schema as $controller => &$controllerOptions) {

            if ($controllerOptions['alias'] != $this->getURI(0)) continue;

            $access = (isset($controllerOptions['access'])

                && ($controllerOptions['access'] >= $_SESSION['user']['roleID'])) ? true : false;

            if (empty($this->getURI(1))) {

                $actionAlias = current($controllerOptions['actions'])['alias'];

                $this->redirect('/' . $controllerOptions['alias'] . '/' . $actionAlias);
            }

            $this->setController($controller);

            $controllerOptions['active'] = true;

            foreach($controllerOptions['actions'] as $action => $actionOptions) {

                if ($actionOptions['alias'] != $this->getURI(1)) continue;

                if (isset($actionOptions['access']))

                    $access = ($actionOptions['access'] >= $_SESSION['user']['roleID']) ? true : false;

                if (!$access) throw new Exception('Доступ заборонено');

                $this->setAction($action);

                $this->setTitle($controllerOptions['title'] . ' / ' . $actionOptions['title']);

                if (isset($actionOptions['isDatabase']))

                    $this->setIsDatabase($actionOptions['isDatabase']);

                if (isset($actionOptions['isView']))

                    $this->setIsView($actionOptions['isView']);
            }
        }
    }

    /**
     * Зберігає контролер
     *
     * @param string $controller Назва поточного контролера
     */
    protected function setController(string $controller): void {

        $this->controller = $controller;
    }

    /**
     * Повертає контролер
     *
     * @return string Назва контролера
     */
    public function getController(): string {

        return $this->controller;
    }

    /**
     * Зберігає поточну дію контролера
     *
     * @param string $action Назва поточної дії контролера
     */
    protected function setAction(string $action): void {

        $this->action = $action;
    }

    /**
     * Повертає поточну дію контролера
     *
     * @return string Назва дії
     */
    public function getAction(): string {

        return $this->action;
    }

    /**
     * Зберігає поточну найменування сторінки
     *
     * @param string $title Назва поточної сторінки
     */
    protected function setTitle(string $title): void {

        $this->title = $title;
    }

    /**
     * Повертає заголовок сторінки
     *
     * @return string Заголовок сторінки
     */
    public function getTitle() {

        return $this->title;
    }

    /**
     * Зберігає ознаку автоматичного створення об'єкта бази даних
     *
     * @param boolean $isDatabase Ознака створення
     */
    protected function setIsDatabase(bool $isDatabase): void {

        $this->isDatabase = $isDatabase;
    }

    /**
     * Повертає ознаку автоматичного створення об'єкта бази даних
     *
     * @return boolean Ознака створення
     */
    public function isDatabase(): bool {

        return $this->isDatabase;
    }

    /**
     * Зберігає ознаку автоматичного створення об'єкта вигляду
     *
     * @param boolean $isView Ознака створення
     */
    protected function setIsView(bool $isView): void {

        $this->isView = $isView;
    }

    /**
     * Повертає ознаку автоматичного створення об'єкта вигляду
     *
     * @return boolean Ознака створення
     */
    public function isView(): bool {

        return $this->isView;
    }

    /**
     * Здійснює переадресацію
     *
     * @param string|null $uri Адреса сторінки сайту, на яку потрібно переадресувати
     * @param integer $code Код переадресації HTTP-протоколу
     */
    public function redirect($uri = '/', int $code = 303): void {

        header('HTTP/1.x '. $code . ' ' . $this->redirects[$code]);

        header('Location: '. HOST . urldecode($uri));

        exit($code);
    }
}