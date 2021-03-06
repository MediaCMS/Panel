<?php
/**
 * Абстрактний базовий клас контролера
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
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

    /** @var \SimpleXMLElement Поточний елемент сторінки у вигляді */
    protected $node;

    /** @var API Прикладний програмний інтерфейс */
    protected $api;

    /** @var boolean Ознака створення меню */
    protected $menu = true;

    /** @var array Підменю за налаштуванням */
    protected $submenu = [

        ['title' => 'Створити', 'alias' => 'редагування'],
        ['title' => 'Фільтр', 'modal' => '#filter']
    ];

    /** @var boolean Ознака завантаження WYSIWYG-редактора */
    protected $editor = false;

    /** @var array Дані поточного користувача */
    protected $user;

    /** @var array Фільтр списку */
    protected $filter = [];

    /** @var array Фільтр списку за замовчуванням */
    protected $filterDefault = [

        '_status' => 1, '_orderField' => 'title', '_orderDirection' => 1,

        '_offset' => 0, '_limit' => 15
    ];

    /** @var array Можливі назви полів для сортування списку
     *
     * [['title' => '', 'value' => '']]
     */
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

        if ($this->router->isDatabase())

            $this->database = new Database(DB_NAME, DB_USER, DB_PASSWORD);

        if ($this->router->isView()) {

            $this->view = new View($this->editor);

            $this->view->setTitle($this->router->getTitle());

            $this->node = $this->view->setNode($this->router->getController(), $this->router->getAction());

        } else {

            $this->api = new API();
        }

        if (isset($_SESSION['user'])) {

            $this->user = $_SESSION['user'];

            if ($this->router->isView()) $this->view->setUser($this->user);
        }
    }

    /**
     * Виводить список
     */
    public function index(): void {

        $this->filter();

        $this->indexAdvanced();

        $this->database->call($this->router->getController() . 'GetIndex', $this->filter);

        $this->node->addAttribute('index', '/' . $this->router->getURI(0) . '/список');

        $this->node->addAttribute('edit', '/' . $this->router->getURI(0) . '/редагування');

        $itemsNode = $this->node->addChild('items');

        $i = 1;

        while($item = $this->database->getResult()) {

            $itemNode = $itemsNode->addChild('item');

            $item['position'] = $this->filter['_offset'] + $i;

            $this->view->setItem($itemNode, $item);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Створює та виводить фільтр списку
     */
    protected function filter(): void {

        $title = strtolower($this->router->getController());

        if (isset($_SESSION['filters'][$title]))

            $this->filter = $_SESSION['filters'][$title];

        else

            $this->filter = $this->filterDefault;

        if (isset($_POST['_submit'])) {

            $post = [];

            foreach ($_POST as $key => $value)

                $post[$key] = ($value === '') ? null : $value;

            unset($post['_submit']);

            $this->filter = array_replace($this->filter, $post);
        }

        if ($this->router->issetURI(2)) $this->page = $this->router->getURI(2);

        $this->filter['_offset'] = $this->filter['_limit'] * ($this->page - 1);

        if ($this->router->isView())

            $this->view->setFilter($this->filter, $this->orderFields, $this->router->getURI(0));

        $_SESSION['filters'][$title] = $this->filter;
    }

    /**
     * Виводить список (розширення)
     */
    public function indexAdvanced(): void {}

    /**
     * Редагує дані
     */
    public function edit(): void {

        $id = $this->router->getURI(2);

        $this->submenu = [['title' => 'Закрити', 'alias' => 'список']];

        if (count($_POST) > 0) $this->submit();

        $this->editAdvanced($id);

        if (isset($id)) $this->get($id);
    }

    /**
     * Редагує дані (додатково)
     *
     * @param integer|null $id Ідентифікатор об'єкта
     */
    public function editAdvanced(int $id = null): void {}

    /**
     * Опрацьовує дані з форми
     */
    protected function submit(): void {

        try {

            if (isset($_POST['_save'])) $this->set($_POST);

            if (isset($_POST['_delete'])) $this->unset($_POST['id']);

            $this->router->redirect('/' . $this->router->getURI(0));

        } catch (Exception $exception) {

            $this->submitRepeat($_POST);

            throw $exception;
        }
    }

    /**
     * Повертає дані у форму
     *
     * @param array $form Дані форми
     */
    protected function submitRepeat(array $form): void {

        $this->editAdvanced();

        if (isset($form['time']) && is_null($form['time']))

            $form['time'] = date('Y-m-d H:i:s');

        $this->view->setItem($this->node, $form);
    }

    /**
     * Отримує дані з БД
     *
     * @param integer $id Ідентифікатор набору даних
     * @return array Дані
     */
    protected function get(int $id): array {

        $this->database->call($this->router->getController() . 'Get', $id);

        $data = $this->database->getResult();

        $this->view->setItem($this->node, $data);

        return $data;
    }

    /**
     * Зберігає дані в БД
     *
     * @param array $form Дані форми
     */
    protected function set(array $form): void {

        if (isset($form['title']))

            $form['alias'] = System::getAlias($form['title']);

        $form['user'] = $this->user['id'];

        unset($form['_save']);

        $this->database->call($this->router->getController() . 'Set', $form);
    }

    /**
     * Видаляє дані з БД
     *
     * @param integer $id Ідентифікатор набору даних
     */
    protected function unset(int $id): void {

        $this->database->call($this->router->getController() . 'Unset', $id);
    }

    /**
     * Додає у вигляд результат запиту з БД
     *
     * @param string $itemsTitle Назва загального елемента
     * @param string $itemTitle Назва дочірніх елементів
     */
    public function setItems(string $itemsTitle = 'items', string $itemTitle = 'item'): void {

        $parentNode = $this->node->addChild($itemsTitle);

        while($row = $this->database->getResult()) {

            $childNode = $parentNode->addChild($itemTitle);

            $this->view->setItem($childNode, $row);
        }
    }

    /**
     * Доступ заборонено
     */
    public function denied(): void {

        $alert = 'Доступ заборонено';

        $this->view->setAlert($alert, 'danger');

        //$this->router->redirect();

        unset($this->node);

        throw new Exception($alert);
    }

    /**
     * Створює та додає у вигляд виняток
     *
     * @param \Exception $exception Виняток
     */
    public function exception(\Exception $exception): void {

        if ($this->router->isView()) {

            $this->view->setException($exception);

        } else {

            $this->api->setException($exception);
        }
    }

    /**
     * Деструктор контроллера
     */
    public function __destruct() {

        if (!isset($this->view)) {

            $this->api->print();

            return;
        }

        if ($this->menu) {

            $this->view->setMenu($this->router->getSchema());

            $this->view->setSubmenu($this->submenu, $this->router->getURI(0));
        }

        if (DEVELOPMENT) {

            $queries = null;

            if (isset($this->database))

                $queries = $this->database->getQueries();

            $this->view->setDebug($queries);
        }

        print $this->view->getHTML();
    }
}