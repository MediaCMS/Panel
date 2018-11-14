<?php
/**
 * Абстрактний базовий клас контролера
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel;

abstract class Controller {

    /** @var Router Маршрутизатор */
    protected $router;

    /** @var Database База данних */
    protected $database;

    /** @var View Вигляд (вид, представлення) сторінки */
    protected $view;

    /** @var boolean Ознака створення меню */
    protected $menu = true;

    /** @var array Підменю за налаштуванням */
    protected $submenu = [

        ['title' => 'Створити', 'alias' => 'редагування'],
        ['title' => 'Фільтр', 'modal' => '#filter']
    ];

    /** @var integer Ідентифікатор поточного користувача */
    protected $user;

    /** @var array Фільтр списку */
    protected $filter = [

        '_view' => 'standard', '_status' => 1, '_orderField' => 'title', '_orderDirection' => 1,

        '_offset' => 0, '_limit' => 7
    ];

    /** @var array Можливі назви полів для сортування списку  */
    protected $orderFields = [];

    /** @var integer Номер поточної сторінки списку */
    protected $page = 1;

    /** @var string Тип сторінки виводу */
    protected $outputType = 'text/html';

    /** @var \Exception Виняток */
    protected $exception;


    /**
     * Конструктор класу
     *
     * @param Router $router Маршрутизатор
     */
    public function __construct(Router $router) {

        header(sprintf('Content-User: %s; charset=utf-8', $this->outputType));

        $this->router = $router;

        if ($this->router->getIsDatabase())

            $this->database = new Database(DB_NAME, DB_USER, DB_PASSWORD);

        if ($this->router->getIsView()) {

            $this->view = new View();

            $this->view->setTitle($this->router->getTitle());

            $this->view->setNode($this->router->getController(), $this->router->getAction());
        }

        if (isset($_SESSION['user'])) $this->user = $_SESSION['user'];
    }

    /**
     * Створює та виводить фільтр списку
     *
     * @param array $default Значення фільтру за налашуванням
     */
    protected function setFilter(array $default = []): void {

        $title = strtolower($this->router->getController());

        if (!isset($_SESSION['filters'][$title])) $_SESSION['filters'][$title] = [];

        $this->filter = array_replace($this->filter, $default, $_SESSION['filters'][$title]);

        if (count($_POST) > 0) {

            $post = $_POST;

            unset($post['submit']);

            $post = array_map(function($value) {return $value === "" ? NULL : $value;}, $post);

            $this->filter = array_replace($this->filter, $post);
        }

        if ($this->router->issetURI(2)) $this->page = $this->router->getURI(2);

        $this->filter['_offset'] = $this->filter['_limit'] * ($this->page - 1);

        $_SESSION['filters'][$title] = $this->filter;

        if ($this->router->getIsView())

            $this->view->setFilter($this->filter, $this->orderFields, $this->router->getURI(0));
    }

    /**
     * Додає результат запиту до БД у вигляд
     *
     * @param \SimpleXMLElement $node Елемент, в який необхідно додати колекцію
     * @param string $item Назва дочірнього елемента
     */
    public function setItems(\SimpleXMLElement $node = null, string $item = 'item'): void {

        $i = 1;

        $node = $node ?? $this->view->getNode();

        while($row = $this->database->getResult()) {

            $itemNode = $node->addChild($item);

            $itemNode->addAttribute('position', $this->filter['_offset'] + $i);

            $uri = '/' . $this->router->getURI(0) . '/редагування/' . $row['id'];

            $itemNode->addAttribute('edit', $uri);

            $this->view->setItem($itemNode, $row);

            $i ++;
        }
    }

    /**
     * Створює та виводить пагінацію списку
     */
    protected function setPagination(): void {

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Створює та додає у вигляд виняток
     *
     * @param \Exception $exception Виняток
     */
    public function setException(\Exception $exception): void {

        $this->view->setException($exception);
    }

    /**
     * Деструктор контроллера
     */
    public function __destruct() {

        if (!isset($this->view)) return;

        if ($this->menu) {

            $this->view->setMenu($this->router->getSchema());

            $this->view->setSubmenu($this->submenu, $this->router->getURI(0));
        }

        if (DEVELOPMENT) {

            $queries = null;

            if (isset($this->autoload['Database']))

                $queries = $this->database->getQueries();

            $this->view->setDebug($queries);
        }

        print $this->view->getHTML();
    }
}