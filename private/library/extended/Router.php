<?php
/**
 * Маршрутизатор (вибір необхідного контролера)
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel\Router
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

class Router {

    /** @var array Перелік частин адреси сторінки */
    protected $uri;

    /** @var \SimpleXMLElement Дерево схеми сайта */
    protected $tree;

    /** @var array Поточні гілки дерева схеми сайта */
    protected $branches;

    /** @var array Головне меню сайту */
    protected $menu;

    /** @var array Підменю поточної сторінки сайту */
    protected $submenu;

    /** @var string Назва поточного контролера */
    protected $controller = '\MediaCMS\Panel\Controller';

    /** @var string Заголовок сторінки */
    protected $title;

    /** @var string Шаблон вигляду сторінки */
    protected $template;


    /**
     * Конструктор класу
     */
    public function __construct() {

        $this->setURI();

        $this->setTree();

        $this->setBranches($this->tree, $this->uri);

        if (isset($_SESSION['token']) && (strlen($_SESSION['token']) == 32)) {

            $this->setMenu($this->tree);

            $this->setController();

            $this->setTitle();

            $this->setTemplate();

        } else {

            $this->controller .= '\Access\Login';

            $this->template = 'AccessLogin';

            $this->title = 'Авторизація';
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
     * Отримує та зберігає дерево схеми сайта
     */
    private function setTree(): void {

        $this->tree = PATH_PRIVATE . '/schema.xml';

        $this->tree = file_get_contents($this->tree);

        $this->tree = new \SimpleXMLElement($this->tree);
   }

    /**
     * Повертає дерево схеми сайта
     */
    public function getTree(): \SimpleXMLElement {

        return $this->tree;
    }

    /**
     * Отримує та зберігає поточні гілки дерева схеми сайту
     *
     * @param \SimpleXMLElement $branchElement Гілка дерева
     * @param array $uri Перелік псевдонімів адреси сторінки
     */
    private function setBranches(\SimpleXMLElement $branchElement, array $uri): void {

        $alias = array_shift($uri);

        foreach($branchElement->branch as $childBranchElement) {

            if ($childBranchElement->attributes()->alias == $alias) {

                $branch['title'] = (string) $childBranchElement->attributes()->title;

                $branch['alias'] = (string) $childBranchElement->attributes()->alias;

                $branch['controller'] = (string) $childBranchElement->attributes()->controller;

                if (isset($childBranchElement->attributes()->menu))

                    $branch['menu'] = (string) $childBranchElement->attributes()->menu;

                $this->branches[] = $branch;

                if (isset($childBranchElement->submenu)) {

                    foreach($childBranchElement->submenu->item as $item) {

                        $submenu['title'] = (string) $item->attributes()->title;

                        if (isset($item->attributes()->alias))

                            $submenu['alias'] = (string) $item->attributes()->alias;

                        if (isset($item->attributes()->modal))

                            $submenu['modal'] = (string) $item->attributes()->modal;

                        $this->submenu[] = $submenu;
                    }
                }

                if (count($childBranchElement) > 0) $this->setBranches($childBranchElement, $uri);
            }
        }
    }

    /**
     * Повертає поточні гілки дерева схеми сайту
     *
     * @return array Список гілок
     */
    public function getBranches(): array {

        return $this->branches;
    }

    /**
     * Вибирає та зберігає меню з дерева схеми сайту
     *
     * @param \SimpleXMLElement $branch Гілка дерева
     * @param array $parentURI Перелік псевдонімів адреси сторінки
     */
    private function setMenu(\SimpleXMLElement $branch, array $parentURI = null): void {

        foreach($branch as $childBranch) {

            if ($childBranch->getName() != 'branch') continue;

            $uri = $parentURI;

            $uri[] = (string) $childBranch->attributes()->alias;

            if (isset($childBranch->attributes()->menu)) {

                $item['title'] = (string) $childBranch->attributes()->menu;

                $item['uri'] = $uri;

                $this->menu[] = $item;
            }

            if (count($childBranch) > 0) $this->setMenu($childBranch, $uri);
        }
    }

    /**
     * Повертає головне меню
     *
     * @return array Список пунктів меню
     */
    public function getMenu(): array {

        return $this->menu;
    }

    /**
     * Повертає підменю поточної сторінки сайту
     *
     * @return array|null Список пунктів меню
     */
    public function getSubmenu(): ?array {

        return $this->submenu;
    }

    /**
     * Отримує та зберігає контролер
     */
    private function setController(): void {

        foreach($this->branches as $branch)

            $this->controller .= '\\' . $branch['controller'];
    }

    /**
     * Повертає контролер
     *
     * @return string Назва контролера
     */
    public function getController() {

        return $this->controller;
    }

    /**
     * Отримує та зберігає заголовок сторінки
     */
    private function setTitle(): void {

        foreach($this->branches as $branch)

            $titles[] = $branch['title'];

        $this->title = implode(' / ', $titles);
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
     * Отримує та зберігає шаблон сторінки
     */
    private function setTemplate(): void {

        foreach($this->branches as $branch)

            $controllers[] = $branch['controller'];

        $this->template = implode('', $controllers);
    }

    /**
     * Повертає шаблон сторінки
     *
     * @return string|null Назва шаблона сторінки
     */
    public function getTemplate(): ?string {

        return $this->template;
    }
}