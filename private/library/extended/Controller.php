<?php
/**
 * Абстрактний базовий клас контролера
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

use MediaCMS\Panel\Exception\Controller as ControllerException;

abstract class Controller {

    /** @var Router Маршрутизатор */
    protected $router;

    /** @var Mapper Мапер БД */
    protected $mapper;

    /** @var View Вигляд (вид, представлення) сторінки */
    protected $view;

    /** @var \SimpleXMLElement Поточний шаблон виводу */
    protected $template;

    /** @var array Перелік клаів для автоматичного завантаження */
    protected $autoload = ['Mapper' => true, 'View' => true];

    /** @var boolean Ознака створення меню */
    protected $menu = true;

    /** @var Filter Фільтр списку */
    protected $filter;

    /** @var integer Кількість суміжних номерів сторінок пагінатора */
    protected $adjacent = 3;

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

    /** @var integer Кількість сторінок в пейджері */
    protected $outputType = 'text/html';

    /** @var \Exception Виняток */
    protected $exception;


    /**
     * Конструктор класу
     *
     * @param Router $router Маршрутизатор
     * @throws \Exception Виняток контроллера
     * @throws ControllerException Виняток контроллера
     */
    public function __construct(Router $router) {

        header(sprintf('Content-User: %s; charset=utf-8', $this->outputType));

        try {

            $this->router = $router;

            if ($this->autoload['View']) {

                $this->view = new View();

                $this->view->setTitle($this->router->getTitle());

                if ($this->menu)

                    $this->view->setMenu($this->router->getMenu(), $this->router->getURI(0));

                if (!is_null($this->router->getSubmenu()))

                    $this->view->setSubmenu($this->router->getSubmenu(), $this->router->getURI(0));

                if (!is_null($this->router->getTemplate())) {

                    $this->template = $this->view->setTemplate($this->router->getTemplate());
                }
            }

            if (isset($this->autoload['Mapper'])) {

                $mapper = new Mapper(DB_NAME, DB_USER, DB_PASSWORD);

                $this->mapper = $mapper;
            }

            if (isset($this->filter)) $this->setFilter();

            $this->run();

            if (isset($this->filter)) $this->setPagination();

        } catch (\Exception $exception) {

            if (isset($this->view)) $this->view->setException($exception);
        }
    }

    /**
     * Абстрактний головний метод контролера
     */
    abstract public function run(): void;

    /**
     * Додає колекцію
     *
     * @param \SimpleXMLElement $node Едемент, в який необхідно додати колекцію
     * @param Collection $collection Колекція, яку необхідно додати у вивід
     */
    public function setCollection(\SimpleXMLElement $node, Collection $collection): void {

        $reflect = new \ReflectionClass($collection);

        $collectionTitle = strtolower($reflect->getShortName());

        foreach($collection as $entity) {

            $entityNode = $node->addChild($collectionTitle);

            $this->setEntity($entityNode, $entity);
        }
    }

    /**
     * Додає сутність
     *
     * @param \SimpleXMLElement $node Едемент, в який необхідно додати сутність
     * @param Entity $entity Сутність
     * @param string|array $childs Перелік властивостей сутностей які необхідно додати як елементи
     */
    public function setEntity(\SimpleXMLElement $node, Entity $entity, $childs = null): void {

        if (isset($childs) && !is_array($childs)) $childs = [$childs];

        foreach($entity as $name => $value) {

            if (!isset($value)) continue;

            if (isset($childs) && in_array($name, $childs)) {

                $node->addChild($name, $value);

            } else {

                $node->addAttribute($name, $value);
            }
        }
    }

    /**
     * Отримує перелік статусів та додає їх у вигляд
     *
     * @param \SimpleXMLElement $node Батьківський елемент виводу
     * @param Filter $filter Фільтр для списку
     */
    protected function setStatuses(\SimpleXMLElement $node, Filter $filter): void {

        $statuses = $filter->statuses;

        $statusesNode = $node->addChild('statuses');

        $statusesNode->addAttribute('value', $filter->status);

        $statusNode = $statusesNode->addChild('status');

        $statusNode->addAttribute('key', '');

        $statusNode->addAttribute('title', 'Всі статуси');

        foreach($statuses as $key => $status) {

            $statusNode = $statusesNode->addChild('status');

            $statusNode->addAttribute('key', $key);

            $statusNode->addAttribute('title', $status);
        }
    }

    /**
     * Створює фільтр для списку та додає його у вигляд
     */
    protected function setFilter(): void {

        if (!isset($_SESSION['filters']['users'])) $_SESSION['filters']['users'] = null;

        $filter = &$_SESSION['filters']['users'];

        if (count($_POST) > 0) $filter = $_POST;

        $this->filter = 'MediaCMS\Panel\Filter\\' . $this->filter;

        $this->filter = new $this->filter($filter);

        $filterNode = $this->template->addChild('filter');

        $filterNode->addAttribute('uri', '/' . $this->router->getURI(0) . '/список');

        if ($this->router->issetURI(2))

            $this->filter->pageCurrent = $this->router->getURI(2);

        /* Статуси */

        $this->setStatuses($filterNode, $this->filter);

        /* Сортування */

        $orderNode = $filterNode->addChild('order');

        $orderNode->addAttribute('field', $this->filter->orderField);

        $orderNode->addAttribute('direction', $this->filter->orderDirection);

        $orderFieldsNode = $orderNode->addChild('fields');

        $orderFields = $this->filter->orderFields;

        foreach($orderFields as $field => $title) {

            $orderFieldNode = $orderFieldsNode->addChild('field');

            $orderFieldNode->addAttribute('field', $field);

            $orderFieldNode->addAttribute('title', $title);
        }

        $orderDirectionsNode = $orderNode->addChild('directions');

        $orderDirections = $this->filter->orderDirections;

        foreach($orderDirections as $code => $title) {

            $orderDirectionNode = $orderDirectionsNode->addChild('direction');

            $orderDirectionNode->addAttribute('code', $code);

            $orderDirectionNode->addAttribute('title', $title);
        }

        /* Вивід */

        $rowsNode = $filterNode->addChild('rows');

        $rowsNode->addAttribute('limit', $this->filter->rowsLimit);

        $rowsLimitsNode = $rowsNode->addChild('limits');

        foreach($this->filter->rowsLimits as $value => $title) {

            $rowsLimitNode = $rowsLimitsNode->addChild('limit');

            $rowsLimitNode->addAttribute('value', $value);

            $rowsLimitNode->addAttribute('title', $title);
        }

        $this->setFilterExtension();
    }

    /**
     * Створює розширення фільтра для списку та додає його у вигляд
     */
    protected function setFilterExtension(): void {}

    /**
     * Додає пагінацію для списка
     */
    public function setPagination(): void {

        if ($this->filter->pagesCount < 2) return;

        $pagination = range(1, $this->filter->pagesCount);

        if (($adjacent = floor($this->adjacent / 2) * 2 + 1) >= 1) {

            $paginationMin = count($pagination) - $this->adjacent;

            $paginationMax = intval($this->filter->pageCurrent) - ceil($this->adjacent / 2);

            $paginationOffset = max(0, min($paginationMin, $paginationMax));

            $pagination = array_slice($pagination, $paginationOffset, $this->adjacent);
        }

        $paginationNode = $this->template->addChild('pagination');

        $uri = '/' . $this->router->getURI(0) . '/список';

        $paginationNode->addAttribute('uri', $uri);

        $paginationNode->addAttribute('page', $this->filter->pageCurrent);

        $paginationNode->addAttribute('pages', $this->filter->pagesCount);

        $pagesNode = $paginationNode->addChild( 'pages' );

        foreach($pagination AS $page) {

            $pageNode = $pagesNode->addChild('page');

            $pageNode->addAttribute('title', 'Сторінка №'.$page);

            $pageNode->addAttribute('value', $page);
        }

        if ($this->filter->pageCurrent > 1) {

            $title = $this->view->getTitle();

            $title = sprintf('%s (сторінка №%d)', $title, $this->filter->pageCurrent);

            $this->view->setTitle($title);
        }
    }

    /**
     * Здійснює переадресацію
     *
     * @param   string $uri Адреса сторінки сайту, на яку потрібно переадресувати
     * @param   integer $code Код переадресації HTTP-протоколу
     */
    final protected function redirect(string $uri = '/', int $code = 303): void {

        $uri = ($uri) ?? urldecode($_SERVER['REQUEST_URI']);

        header('HTTP/1.x '. $code . ' ' . $this->redirects[$code]);

        header('Location: '. HOST . $uri);

        exit($code);
    }

    /**
     * Деструктор контроллера
     */
    public function __destruct() {

        if (isset($this->view)) {

            if (DEVELOPMENT)

                $this->view->setDebug($this->mapper->getQueries());

            print $this->view->getHTML();
        }
    }
}