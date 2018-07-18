<?php
/**
 * Контролер головної сторінки сайту
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel\Controller\Home
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel\Controller;

use  MediaCMS\Panel\Controller;

//use MediaCMS\Panel\Repository\Article as ArticleRepository;
//use MediaCMS\Panel\Repository\Tag as TagRepository;

class Home extends Controller {

    /** @var string Назва шаблону контролера */
    protected $template = 'home';

    /** @var string Назва головної сторінки */
    protected $title = 'Головна сторінка';


    /**
     * Головний метод контролера
     */
    public function run(): void {
/*
        $this->view->attributes()->title = $this->title;

        $this->view->main->home->addChild('slideshow');

        $articleRepository = new ArticleRepository($this->mapper);

        $articleCollection = $articleRepository->getByIds($this->slideshow);

        foreach($articleCollection as $articleEntity) {

            $slideView = $this->view->main->home->slideshow->addChild('slide');

            $slideView->addAttribute('title', $articleEntity->get('title'));

            $slideView->addAttribute('parent', $articleEntity->get('parentTitle'));

            $slideView->addAttribute('description', $articleEntity->get('description'));

            $image = _HOST_PHOTO . $articleEntity->get('image');

            $slideView->addAttribute('image', $image);

            $slideView->addAttribute('alias', $articleEntity->get('alias'));
        }

        $this->view->main->home->addChild('cloud');

        $tagRepository = new TagRepository($this->mapper);

        $tagCollection = $tagRepository->getList();

        foreach($tagCollection as $tagEntity) {

            $tagView = $this->view->main->home->cloud->addChild('tag');

            $popularity = $tagEntity->get('popularity');

            if (in_array($tagEntity->get('id'), $this->slideshow)) {

                $key = array_search($tagEntity->get('id'), $this->slideshow);

                $popularity = $key + 1;
            }

            $tagView->addAttribute('popularity', $popularity);

            $tagView->addAttribute('title', $tagEntity->get('title'));

            $tagView->addAttribute('alias', $tagEntity->get('alias'));

            if (strlen($tagEntity->get('location')) > 0) {

                $location = json_decode($tagEntity->get('location'), true);

                $tagView->addAttribute('latitude', $location['center']['latitude']);

                $tagView->addAttribute('longitude', $location['center']['longitude']);
            }
        }
*/
    }
}