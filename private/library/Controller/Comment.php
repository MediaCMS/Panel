<?php
/**
 * Контролер коментарів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

use MediaCMS\Panel\Controller;
use MediaCMS\Panel\Exception;

class Comment extends Controller {

    /**
     * Створює та виводить фільтр списка коментарів
     */
    protected function filter(): void {

        $this->filter['dateBegin'] = '2018-01-01';

        $this->filter['dateEnd'] = date('Y-m-d');

        parent::filter();
    }

    /**
     * Виводить список коментарів
     */
    public function index(): void {

        unset($this->submenu[0]);

        parent::index();
    }

    /**
     * Редагує коментар
     */
    public function edit(): void {

        if (is_null($this->router->getURI(2))) {

            $this->router->redirect('/' . $this->router->getURI(0));

            throw new Exception('Відсутній ідентифікатор коментаря');
        }

        parent::edit();
    }
}