<?php
/**
 * Контролер для виводу списку статичних сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Controller\Page;

use MediaCMS\Panel\Controller\Page as PageController;
use MediaCMS\Panel\Filter\Page as PageFilter;
use MediaCMS\Panel\Repository\Page as PageRepository;

class Index extends PageController {

    /** @var PageFilter Список даних фільтру */
    protected $filter = 'Page';


    /**
     * Головний метод контролера
     */
    public function run(): void {

        $this->repository = new PageRepository($this->mapper);

        $pageCollection = $this->repository->getIndex($this->filter);

        if (!isset($pageCollection)) return;

        $pagesNode = $this->template->addChild('pages');

        foreach($pageCollection as $key => $pageEntity) {

            $pageNode = $pagesNode->addChild('page');

            $this->setEntity($pageNode, $pageEntity);

            $uri = '/' . $this->router->getURI(0) . '/редагування/' . $pageEntity->id;

            $pageNode->addAttribute('edit', $uri);

            $pageNode->addAttribute('position', $this->filter->rowsOffset + $key + 1);
        }
    }

    /**
     * Створює фільтр для списку статичних сторінок та додає його у вигляд
     */
    protected function setFilterExtension(): void {

        $templateNode = $this->template;

        $filterNode = $templateNode->filter;

        $filterNode->addAttribute('dateBegin', $this->filter->dateBegin);

        $filterNode->addAttribute('dateEnd', $this->filter->dateEnd);

        $filterNode->addAttribute('title', $this->filter->title);

        $filterNode->addAttribute('user', $this->filter->user);

        $this->setUsers($filterNode, true);
    }
}