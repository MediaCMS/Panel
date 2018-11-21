<?php
/**
 * Маршрутизатор (вибір необхідного контролера та дії)
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel;

class Router {

    /** @var array Перелік частин адреси сторінки */
    protected $uri;

    /** @var string Адреса сторінки за налаштуванням */
    protected $uriDefault;

    /** @var array Схема сайта */
    protected $schema;

    /** @var array Типові підрозділи схеми */
    protected $subsections = [

        "список"         => ["title" => "Список", "action" => "Index"],
        "редагування"    => ["title" => "Редагування", "action" => "Edit"],
        "автозаповнення" => ["title" => "Автозаповнення", "action" => "Autocomplete", "isView" => false]
    ];

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

        if (!isset($_SESSION['token']) || !preg_match('/^[0-9a-f]{32}$/', $_SESSION['token'])

            || !isset($_SESSION['user']) || !preg_match('/^\d{1,6}$/', $_SESSION['user'])) {

            $this->setController('User');

            $this->setAction('Login');

            $this->setTitle('Авторизація');

        } else {

            $this->setSchema();

            if ($this->getURI(0) == '')

                $this->redirect($this->getURIDefault());
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
     * Зберігає адресу сторінки сайту за налаштуванням
     *
     * @param string $uri Адреса сторінки
     */
    private function setURIDefault(string $uri): void {

        $this->uriDefault = $uri;
    }

    /**
     * Повертає елемент ідентифікатора сторінки
     *
     * @return string Назва елемента
     */
    public function getURIDefault(): string {

        return $this->uriDefault;
    }

    /**
     * Отримує та зберігає схему сайта
     */
    private function setSchema(): void {

        $this->schema = json_decode(

            file_get_contents(PATH_PRIVATE . '/schema.json'), true
        );

        foreach($this->schema as $sectionAlias => &$section) {

            $subsections = (isset($section['subsections'])) ?

                array_replace($this->subsections, $section['subsections']) : $this->subsections;

            foreach($subsections as $subsectionAlias => $subsection) {

                if (is_null($subsection)) {

                    unset($subsections[$subsectionAlias]);

                } else {

                    $subsections[$subsectionAlias] = $subsection;
                }

                if (($sectionAlias == $this->getURI(0)) && ($subsectionAlias == $this->getURI(1))) {

                    $this->setController($section['controller']);

                    $this->setAction($subsection['action']);

                    $this->setTitle($section['title'] . ' / ' . $subsection['title']);

                    if (isset($subsection['isDatabase']))

                        $this->setIsDatabase($subsection['isDatabase']);

                    if (isset($subsection['isView']))

                        $this->setIsView($subsection['isView']);

                    $section['active'] = true;

                    $subsections[$subsectionAlias]['active'] = true;
                }
             }

            $section['subsections'] = $subsections;

            if (isset($section['default'])) {

                $uri = '/' . $sectionAlias . '/' . key($section['subsections']);

                $this->setURIDefault($uri);
            }

            if (!isset($this->controller)) {

                $this->setController('Common');

                $this->setAction('NotFound');

                $this->setTitle('Сторінку не знайдено');

            }
        }
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
     * @param   string $uri Адреса сторінки сайту, на яку потрібно переадресувати
     * @param   integer $code Код переадресації HTTP-протоколу
     */
    public function redirect(string $uri = '/', int $code = 303): void {

        $uri = ($uri) ?? urldecode($_SERVER['REQUEST_URI']);

        header('HTTP/1.x '. $code . ' ' . $this->redirects[$code]);

        header('Location: '. HOST . $uri);

        exit($code);
    }
}